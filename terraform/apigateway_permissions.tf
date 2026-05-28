resource "aws_lambda_permission" "allow_books_api_register_book" {
  statement_id  = "AllowExecutionFromBooksApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_book.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_books_api_register_loan" {
  statement_id  = "AllowExecutionFromBooksApiGatewayRegisterLoan"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_loan.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}
