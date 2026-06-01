resource "aws_cloudwatch_event_target" "send_to_sqs_book_registered_queue" {
  rule      = aws_cloudwatch_event_rule.book_registered_rule.name
  target_id = "SendToSQSBookRegisteredQueue"
  arn       = aws_sqs_queue.notify_library_book_registered.arn
}

resource "aws_cloudwatch_event_target" "send_to_sqs_loan_registered_queue" {
  rule      = aws_cloudwatch_event_rule.loan_registered_rule.name
  target_id = "SendToSQLoanRegisteredQueue"
  arn       = aws_sqs_queue.notify_library_loan_registered.arn
}

resource "aws_cloudwatch_event_target" "send_to_sqs_loan_returned_queue" {
  rule      = aws_cloudwatch_event_rule.loan_returned_rule.name
  target_id = "SendToSQLoanReturnedQueue"
  arn       = aws_sqs_queue.notify_library_loan_returned.arn
}

resource "aws_cloudwatch_event_target" "send_to_sqs_analyze_demand_queue" {
  rule      = aws_cloudwatch_event_rule.loan_registered_rule.name
  target_id = "SendToSQSAnalyzeDemandQueue"
  arn       = aws_sqs_queue.analyze_demand_loan_registered.arn
}
