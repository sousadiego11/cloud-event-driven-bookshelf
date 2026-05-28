resource "aws_api_gateway_integration" "register_book" {
  rest_api_id             = aws_api_gateway_rest_api.books_api.id
  resource_id             = aws_api_gateway_resource.books.id
  http_method             = aws_api_gateway_method.post_books.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.register_book.invoke_arn
}

resource "aws_api_gateway_integration" "register_loan" {
  rest_api_id             = aws_api_gateway_rest_api.books_api.id
  resource_id             = aws_api_gateway_resource.loans.id
  http_method             = aws_api_gateway_method.post_loans.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.register_loan.invoke_arn
}
