data "aws_iam_policy_document" "lambda_policy_doc" {

  # Logs (CloudWatch)
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = ["*"]
  }

  # DynamoDB
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:DeleteItem"
    ]

    resources = [
      aws_dynamodb_table.books.arn
    ]
  }

  # EventBridge
  statement {
    effect = "Allow"

    actions = [
      "events:PutEvents"
    ]

    resources = ["*"]
  }

  # SQS
  statement {
    effect = "Allow"

    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "sqs:SendMessage"
    ]

    resources = [aws_sqs_queue.library_book_registered_queue.arn]
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  role   = aws_iam_role.lambda_role.id
  policy = data.aws_iam_policy_document.lambda_policy_doc.json
}

resource "aws_iam_role" "lambda_role" {
  name = "bookshelf-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_lambda_function" "register_book" {
  function_name = "bookshelf-register-book"

  filename         = "${path.module}/dummy-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy-lambda.zip")

  handler = "aws-apigateway/register_book.handler"
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn
}

resource "aws_lambda_function" "notify_library_book_registered" {
  function_name = "bookshelf-notify-library-book-registered"

  filename         = "${path.module}/dummy-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy-lambda.zip")

  handler = "aws-sqs/notify_library_book_registered.handler"
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn
}

resource "aws_lambda_event_source_mapping" "notify_library_book_registered_mapping" {
  event_source_arn = aws_sqs_queue.library_book_registered_queue.arn
  function_name    = aws_lambda_function.notify_library_book_registered.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "NotifyLibraryBookRegisteredMapping"
  }
}
