resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = local.websocket.api_name
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"

  tags = {
    Name = "BookshelfWebSocketAPI"
  }
}
