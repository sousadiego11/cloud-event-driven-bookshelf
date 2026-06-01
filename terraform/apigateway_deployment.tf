resource "aws_api_gateway_deployment" "books_api" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.books.id,
      aws_api_gateway_resource.loans.id,
      aws_api_gateway_resource.return_loan.id,
      aws_api_gateway_method.post_books.id,
      aws_api_gateway_method.post_loans.id,
      aws_api_gateway_method.post_return_loan.id,
      aws_api_gateway_integration.register_book.id,
      aws_api_gateway_integration.register_loan.id,
      aws_api_gateway_integration.return_loan.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.register_book,
    aws_api_gateway_integration.register_loan,
    aws_api_gateway_integration.return_loan
  ]
}

resource "aws_api_gateway_stage" "dev" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  deployment_id = aws_api_gateway_deployment.books_api.id
  stage_name    = local.apigateway.stage_name
}
