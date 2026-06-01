resource "aws_api_gateway_method" "post_books" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.books.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post_loans" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.loans.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post_return_loan" {
  rest_api_id   = aws_api_gateway_rest_api.books_api.id
  resource_id   = aws_api_gateway_resource.return_loan.id
  http_method   = "POST"
  authorization = "NONE"
}
