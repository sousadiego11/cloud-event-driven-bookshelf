data "aws_iam_policy_document" "notify_library_book_registered_sqs_policy" {
  version = "2012-10-17"

  statement {
    sid     = "AllowSQSAccessToEvents"
    effect  = "Allow"
    actions = ["sqs:SendMessage"]

    resources = [aws_sqs_queue.notify_library_book_registered.arn]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "initialize_inventory_book_registered_sqs_policy" {
  version = "2012-10-17"

  statement {
    sid     = "AllowSQSAccessToEvents"
    effect  = "Allow"
    actions = ["sqs:SendMessage"]

    resources = [aws_sqs_queue.initialize_inventory_book_registered.arn]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}

resource "aws_sqs_queue_policy" "sqs_policy_allow_events" {
  queue_url = aws_sqs_queue.notify_library_book_registered.id
  policy    = data.aws_iam_policy_document.notify_library_book_registered_sqs_policy.json
}

resource "aws_sqs_queue_policy" "sqs_policy_allow_events_initialize_inventory" {
  queue_url = aws_sqs_queue.initialize_inventory_book_registered.id
  policy    = data.aws_iam_policy_document.initialize_inventory_book_registered_sqs_policy.json
}
