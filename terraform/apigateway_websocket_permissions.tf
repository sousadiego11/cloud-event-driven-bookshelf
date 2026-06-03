resource "aws_lambda_permission" "websocket_register_session" {
  statement_id  = "AllowWebSocketInvokeRegisterSession"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "websocket_close_session" {
  statement_id  = "AllowWebSocketInvokeCloseSession"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.close_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}
