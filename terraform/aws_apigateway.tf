# API Gateway REST API
resource "aws_api_gateway_rest_api" "orders_api" {
  name        = "orders-api"
  description = "REST API for order operations"
}

# Root resource: /orders
resource "aws_api_gateway_resource" "orders" {
  rest_api_id = aws_api_gateway_rest_api.orders_api.id
  parent_id   = aws_api_gateway_rest_api.orders_api.root_resource_id
  path_part   = "orders"
}

# POST /orders
resource "aws_api_gateway_method" "post_orders" {
  rest_api_id   = aws_api_gateway_rest_api.orders_api.id
  resource_id   = aws_api_gateway_resource.orders.id
  http_method   = "POST"
  authorization = "NONE"
}

# Deploy da API
resource "aws_api_gateway_deployment" "orders_api" {
  rest_api_id = aws_api_gateway_rest_api.orders_api.id

  depends_on = [
    aws_api_gateway_method.post_orders
  ]
}

# Stage
resource "aws_api_gateway_stage" "dev" {
  rest_api_id   = aws_api_gateway_rest_api.orders_api.id
  deployment_id = aws_api_gateway_deployment.orders_api.id
  stage_name    = "dev"
}
