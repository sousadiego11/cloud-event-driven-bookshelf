# API Gateway REST API
resource "aws_api_gateway_rest_api" "books_api" {
  name        = "books-api"
  description = "REST API for virtual bookshelf book operations"
}

# Root resource: /books
resource "aws_api_gateway_resource" "books" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  parent_id   = aws_api_gateway_rest_api.books_api.root_resource_id
  path_part   = "books"
}

# Root resource: /loans
resource "aws_api_gateway_resource" "loans" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  parent_id   = aws_api_gateway_rest_api.books_api.root_resource_id
  path_part   = "loans"
}

# POST /books
resource "aws_api_gateway_method" "post_books" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.books.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "register_book" {
  rest_api_id             = aws_api_gateway_rest_api.books_api.id
  resource_id             = aws_api_gateway_resource.books.id
  http_method             = aws_api_gateway_method.post_books.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.register_book.invoke_arn
}

resource "aws_lambda_permission" "allow_books_api_register_book" {
  statement_id  = "AllowExecutionFromBooksApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_book.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}

# POST /loans
resource "aws_api_gateway_method" "post_loans" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.loans.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "register_loan" {
  rest_api_id             = aws_api_gateway_rest_api.books_api.id
  resource_id             = aws_api_gateway_resource.loans.id
  http_method             = aws_api_gateway_method.post_loans.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.register_loan.invoke_arn
}

resource "aws_lambda_permission" "allow_books_api_register_loan" {
  statement_id  = "AllowExecutionFromBooksApiGatewayRegisterLoan"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_loan.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "books_api" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.books.id,
      aws_api_gateway_resource.loans.id,
      aws_api_gateway_method.post_books.id,
      aws_api_gateway_method.post_loans.id,
      aws_api_gateway_integration.register_book.id,
      aws_api_gateway_integration.register_loan.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.register_book,
    aws_api_gateway_integration.register_loan
  ]
}

resource "aws_api_gateway_stage" "dev" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  deployment_id = aws_api_gateway_deployment.books_api.id
  stage_name    = "dev"
}
