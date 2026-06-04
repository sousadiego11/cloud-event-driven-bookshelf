resource "aws_lambda_function" "register_book" {
  function_name = local.lambdas.register_book.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.register_book.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "RegisterBookFunction"
  }
}

resource "aws_lambda_function" "register_loan" {
  function_name = local.lambdas.register_loan.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.register_loan.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "RegisterLoanFunction"
  }
}

resource "aws_lambda_function" "return_loan" {
  function_name = local.lambdas.return_loan.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.return_loan.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "ReturnLoanFunction"
  }
}

resource "aws_lambda_function" "notify_library_book_registered" {
  function_name = local.lambdas.notify_library_book_registered.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.notify_library_book_registered.handler
  runtime = "nodejs20.x"

  environment {
    variables = {
      WEBSOCKET_URL = "https://${aws_apigatewayv2_api.websocket_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_apigatewayv2_stage.websocket_stage.name}"
    }
  }

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "NotifyLibraryBookRegisteredFunction"
  }
}

resource "aws_lambda_function" "notify_library_loan_registered" {
  function_name = local.lambdas.notify_library_loan_registered.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.notify_library_loan_registered.handler
  runtime = "nodejs20.x"

  environment {
    variables = {
      WEBSOCKET_URL = "https://${aws_apigatewayv2_api.websocket_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_apigatewayv2_stage.websocket_stage.name}"
    }
  }

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "NotifyLibraryLoanRegisteredFunction"
  }
}

resource "aws_lambda_function" "notify_library_loan_returned" {
  function_name = local.lambdas.notify_library_loan_returned.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.notify_library_loan_returned.handler
  runtime = "nodejs20.x"

  environment {
    variables = {
      WEBSOCKET_URL = "https://${aws_apigatewayv2_api.websocket_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_apigatewayv2_stage.websocket_stage.name}"
    }
  }

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "NotifyLibraryLoanReturnedFunction"
  }
}

resource "aws_lambda_function" "analyze_demand_loan_registered" {
  function_name = local.lambdas.analyze_demand_loan_registered.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.analyze_demand_loan_registered.handler
  runtime = "nodejs20.x"

  environment {
    variables = {
      WEBSOCKET_URL = "https://${aws_apigatewayv2_api.websocket_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_apigatewayv2_stage.websocket_stage.name}"
    }
  }

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "AnalyzeDemandLoanRegisteredFunction"
  }
}

resource "aws_lambda_function" "register_session" {
  function_name = local.lambdas.register_session.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.register_session.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "RegisterSessionFunction"
  }
}

resource "aws_lambda_function" "close_session" {
  function_name = local.lambdas.close_session.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.close_session.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "CloseSessionFunction"
  }
}

resource "aws_lambda_function" "list_books" {
  function_name = local.lambdas.list_books.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.list_books.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "ListBooksFunction"
  }
}

resource "aws_lambda_function" "list_loans" {
  function_name = local.lambdas.list_loans.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.list_loans.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  tags = {
    Name = "ListLoansFunction"
  }
}
