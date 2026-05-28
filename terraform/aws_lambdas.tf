data "archive_file" "app" {
  type        = "zip"
  source_dir  = "${path.module}/../dist"
  output_path = "${path.module}/../dist/app.zip"
}

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
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
    ]

    resources = [
      aws_dynamodb_table.books.arn,
      "${aws_dynamodb_table.books.arn}/index/*",

      aws_dynamodb_table.loans.arn,
      "${aws_dynamodb_table.loans.arn}/index/*",

      aws_dynamodb_table.inventory.arn,
      "${aws_dynamodb_table.inventory.arn}/index/*"
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

    resources = [
      aws_sqs_queue.notify_library_book_registered.arn
    ]
  }
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

resource "aws_iam_role_policy" "lambda_policy" {
  role   = aws_iam_role.lambda_role.id
  policy = data.aws_iam_policy_document.lambda_policy_doc.json
}

resource "aws_lambda_function" "register_book" {
  function_name = "bookshelf-register-book"

  filename         = data.archive_file.app.output_path
  source_code_hash = data.archive_file.app.output_base64sha256

  handler = "aws-apigateway/register_book.handler"
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "RegisterBookFunction"
  }
}

resource "aws_lambda_function" "register_loan" {
  function_name = "bookshelf-register-loan"

  filename         = data.archive_file.app.output_path
  source_code_hash = data.archive_file.app.output_base64sha256

  handler = "aws-apigateway/register_loan.handler"
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "RegisterLoanFunction"
  }
}

resource "aws_lambda_function" "notify_library_book_registered" {
  function_name = "bookshelf-notify-library-book-registered"

  filename         = data.archive_file.app.output_path
  source_code_hash = data.archive_file.app.output_base64sha256

  handler = "aws-sqs/notify_library_book_registered.handler"
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "NotifyLibraryBookRegisteredFunction"
  }
}

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
