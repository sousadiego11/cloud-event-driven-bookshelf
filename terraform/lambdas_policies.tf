data "aws_iam_policy_document" "lambda_policy_doc" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
      "dynamodb:Scan"
    ]

    resources = [
      aws_dynamodb_table.books.arn,
      "${aws_dynamodb_table.books.arn}/index/*",
      aws_dynamodb_table.loans.arn,
      "${aws_dynamodb_table.loans.arn}/index/*",
      aws_dynamodb_table.inventory.arn,
      "${aws_dynamodb_table.inventory.arn}/index/*",
      aws_dynamodb_table.notifications.arn,
      "${aws_dynamodb_table.notifications.arn}/index/*",
      aws_dynamodb_table.sessions.arn,
      "${aws_dynamodb_table.sessions.arn}/index/*"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "events:PutEvents"
    ]

    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "sqs:SendMessage"
    ]

    resources = [
      aws_sqs_queue.notify_library_book_registered.arn,
      aws_sqs_queue.notify_library_loan_registered.arn,
      aws_sqs_queue.notify_library_loan_returned.arn,
      aws_sqs_queue.analyze_demand_loan_registered.arn
    ]
  }
}
