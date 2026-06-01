resource "aws_api_gateway_resource" "books" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  parent_id   = aws_api_gateway_rest_api.books_api.root_resource_id
  path_part   = local.apigateway.paths.books
}

resource "aws_api_gateway_resource" "loans" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  parent_id   = aws_api_gateway_rest_api.books_api.root_resource_id
  path_part   = local.apigateway.paths.loans
}

resource "aws_api_gateway_resource" "return_loan" {
  rest_api_id = aws_api_gateway_rest_api.books_api.id
  parent_id   = aws_api_gateway_resource.loans.id
  path_part   = local.apigateway.paths.return_loan
}
