resource "aws_sqs_queue" "notify_library_book_registered" {
  name                      = local.queues.notify_library_book_registered.name
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  tags = {
    Environment = "production"
  }
}

resource "aws_sqs_queue" "notify_library_loan_registered" {
  name                      = local.queues.notify_library_loan_registered.name
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  tags = {
    Environment = "production"
  }
}

resource "aws_sqs_queue" "analyze_demand_loan_registered" {
  name                      = local.queues.analyze_demand_loan_registered.name
  delay_seconds             = 0
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  tags = {
    Environment = "production"
  }
}
