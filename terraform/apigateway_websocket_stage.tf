resource "aws_apigatewayv2_stage" "websocket_stage" {
  api_id      = aws_apigatewayv2_api.websocket_api.id
  name        = local.websocket.stage_name
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit   = 100
    throttling_rate_limit    = 50
    data_trace_enabled       = false
    detailed_metrics_enabled = false
    logging_level            = "OFF"
  }

  tags = {
    Name = "BookshelfWebSocketStage"
  }
}
