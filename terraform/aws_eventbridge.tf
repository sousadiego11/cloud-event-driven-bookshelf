resource "aws_cloudwatch_event_rule" "order_created_rule" {
  name        = "cede-order-created"
  description = "Captures OrderCreated events from the e-commerce application"

  event_pattern = jsonencode({
    source      = ["cede.orders"]
    detail-type = ["OrderCreated"]
  })
}

resource "aws_cloudwatch_event_target" "send_to_sqs_order_created_queue" {
  rule      = aws_cloudwatch_event_rule.order_created_rule.name
  target_id = "SendToSQSOrderCreatedQueue"
  arn       = aws_sqs_queue.notification_user_order_created_queue.arn
}
