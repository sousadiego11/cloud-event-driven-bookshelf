resource "aws_api_gateway_rest_api" "books_api" {
  name        = local.apigateway.api_name
  description = "REST API for virtual bookshelf book operations"
}
