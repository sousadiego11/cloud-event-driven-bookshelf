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

  tags = {
    Name = "RegisterLoanFunction"
  }
}

resource "aws_lambda_function" "notify_library_book_registered" {
  function_name = local.lambdas.notify_library_book_registered.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.notify_library_book_registered.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

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

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "NotifyLibraryLoanRegisteredFunction"
  }
}

resource "aws_lambda_function" "initialize_inventory_book_registered" {
  function_name = local.lambdas.initialize_inventory_book_registered.function_name

  filename         = "${path.root}/placeholder.zip"
  source_code_hash = filebase64sha256("${path.root}/placeholder.zip")

  handler = local.lambdas.initialize_inventory_book_registered.handler
  runtime = "nodejs20.x"

  role = aws_iam_role.lambda_role.arn

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]

  tags = {
    Name = "InitializeInventoryBookRegisteredFunction"
  }
}
