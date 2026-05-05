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
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:UpdateItem"
    ]

    # resources = [aws_dynamodb_table.my_table.arn]
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

    resources = [aws_sqs_queue.notification_user_order_created_queue.arn]
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  role   = aws_iam_role.lambda_role.id
  policy = data.aws_iam_policy_document.lambda_policy_doc.json
}

resource "aws_iam_role" "lambda_role" {
  name = "cede-lambda-role"

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

resource "aws_lambda_function" "create_order" {
  function_name = "cede-create-order"

  filename         = "${path.module}/dummy-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy-lambda.zip")

  handler = "aws-apigateway/create_order.handler"
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn
}

resource "aws_lambda_function" "notify_user_order_created" {
  function_name = "cede-notify-user-order-created"

  filename         = "${path.module}/dummy-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/dummy-lambda.zip")

  handler = "aws-sqs/order_created_v1_notify_user.handler"
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn
}

resource "aws_lambda_event_source_mapping" "notify_user_order_created_mapping" {
  event_source_arn = aws_sqs_queue.notification_user_order_created_queue.arn
  function_name    = aws_lambda_function.notify_user_order_created.arn

  tags = {
    Name = "NotifyUserOrderCreatedMapping"
  }
}
