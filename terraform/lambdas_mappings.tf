resource "aws_lambda_event_source_mapping" "notify_library_book_registered_mapping" {
  event_source_arn = aws_sqs_queue.notify_library_book_registered.arn
  function_name    = aws_lambda_function.notify_library_book_registered.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "NotifyLibraryBookRegisteredMapping"
  }
}

resource "aws_lambda_event_source_mapping" "notify_library_loan_registered_mapping" {
  event_source_arn = aws_sqs_queue.notify_library_loan_registered.arn
  function_name    = aws_lambda_function.notify_library_loan_registered.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "NotifyLibraryLoanRegisteredMapping"
  }
}

resource "aws_lambda_event_source_mapping" "notify_library_loan_returned_mapping" {
  event_source_arn = aws_sqs_queue.notify_library_loan_returned.arn
  function_name    = aws_lambda_function.notify_library_loan_returned.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "NotifyLibraryLoanReturnedMapping"
  }
}

resource "aws_lambda_event_source_mapping" "analyze_demand_loan_registered_mapping" {
  event_source_arn = aws_sqs_queue.analyze_demand_loan_registered.arn
  function_name    = aws_lambda_function.analyze_demand_loan_registered.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "AnalyzeDemandLoanRegisteredMapping"
  }
}
