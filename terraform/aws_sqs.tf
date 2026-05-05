
resource "aws_sqs_queue" "notification_user_order_created_queue" {
  name                      = "cede-notification-user-order-created"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  tags = {
    Environment = "production"
  }
}

resource "aws_sqs_queue_policy" "sqs_policy_allow_events" {
  queue_url = aws_sqs_queue.notification_user_order_created_queue.id
  policy    = data.aws_iam_policy_document.sqs_policy.json
}

data "aws_iam_policy_document" "sqs_policy" {
  version = "2012-10-17"

  statement {
    sid     = "AllowSQSAccessToEvents"
    effect  = "Allow"
    actions = ["sqs:SendMessage"]

    resources = [aws_sqs_queue.notification_user_order_created_queue.arn]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}
