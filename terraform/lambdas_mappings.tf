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

resource "aws_lambda_event_source_mapping" "initialize_inventory_book_registered_mapping" {
  event_source_arn = aws_sqs_queue.initialize_inventory_book_registered.arn
  function_name    = aws_lambda_function.initialize_inventory_book_registered.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "InitializeInventoryBookRegisteredMapping"
  }
}
