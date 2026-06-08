# OPTIONS - /books
resource "aws_api_gateway_method" "options_books" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.books.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_books" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.options_books.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options_books" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.options_books.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_books" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.options_books.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.options_books]
}


# OPTIONS - /loans
resource "aws_api_gateway_method" "options_loans" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.loans.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_loans" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.loans.id
  http_method = aws_api_gateway_method.options_loans.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options_loans" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.loans.id
  http_method = aws_api_gateway_method.options_loans.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_loans" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.loans.id
  http_method = aws_api_gateway_method.options_loans.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.options_loans]
}


# OPTIONS - /loans/return
resource "aws_api_gateway_method" "options_return_loan" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.return_loan.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_return_loan" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.return_loan.id
  http_method = aws_api_gateway_method.options_return_loan.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options_return_loan" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.return_loan.id
  http_method = aws_api_gateway_method.options_return_loan.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_return_loan" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  resource_id = aws_api_gateway_resource.return_loan.id
  http_method = aws_api_gateway_method.options_return_loan.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.options_return_loan]
}
