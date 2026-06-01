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

data "aws_iam_policy_document" "notify_library_loan_registered_sqs_policy" {
  version = "2012-10-17"

  statement {
    sid     = "AllowSQSAccessToEvents"
    effect  = "Allow"
    actions = ["sqs:SendMessage"]

    resources = [aws_sqs_queue.notify_library_loan_registered.arn]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "notify_library_loan_returned_sqs_policy" {
  version = "2012-10-17"

  statement {
    sid     = "AllowSQSAccessToEvents"
    effect  = "Allow"
    actions = ["sqs:SendMessage"]

    resources = [aws_sqs_queue.notify_library_loan_returned.arn]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "analyze_demand_loan_registered_sqs_policy" {
  version = "2012-10-17"

  statement {
    sid     = "AllowSQSAccessToEvents"
    effect  = "Allow"
    actions = ["sqs:SendMessage"]

    resources = [aws_sqs_queue.analyze_demand_loan_registered.arn]

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

resource "aws_sqs_queue_policy" "sqs_policy_allow_events_notify_loan" {
  queue_url = aws_sqs_queue.notify_library_loan_registered.id
  policy    = data.aws_iam_policy_document.notify_library_loan_registered_sqs_policy.json
}

resource "aws_sqs_queue_policy" "sqs_policy_allow_events_notify_loan_returned" {
  queue_url = aws_sqs_queue.notify_library_loan_returned.id
  policy    = data.aws_iam_policy_document.notify_library_loan_returned_sqs_policy.json
}

resource "aws_sqs_queue_policy" "sqs_policy_allow_events_analyze_demand" {
  queue_url = aws_sqs_queue.analyze_demand_loan_registered.id
  policy    = data.aws_iam_policy_document.analyze_demand_loan_registered_sqs_policy.json
}
