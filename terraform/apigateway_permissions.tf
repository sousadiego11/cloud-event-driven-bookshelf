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

resource "aws_lambda_permission" "allow_books_api_return_loan" {
  statement_id  = "AllowExecutionFromBooksApiGatewayReturnLoan"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.return_loan.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_books_api_list_books" {
  statement_id  = "AllowExecutionFromBooksApiGatewayListBooks"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_books.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_books_api_list_loans" {
  statement_id  = "AllowExecutionFromBooksApiGatewayListLoans"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_loans.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.books_api.execution_arn}/*/*"
}
