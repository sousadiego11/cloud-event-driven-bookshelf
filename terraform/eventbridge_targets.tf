resource "aws_cloudwatch_event_target" "send_to_sqs_book_registered_queue" {
  rule      = aws_cloudwatch_event_rule.book_registered_rule.name
  target_id = "SendToSQSBookRegisteredQueue"
  arn       = aws_sqs_queue.notify_library_book_registered.arn
}

resource "aws_cloudwatch_event_target" "send_to_sqs_initialize_inventory_book_registered_queue" {
  rule      = aws_cloudwatch_event_rule.book_registered_rule.name
  target_id = "SendToSQSInitializeInventoryBookRegisteredQueue"
  arn       = aws_sqs_queue.initialize_inventory_book_registered.arn
}
