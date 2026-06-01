resource "aws_cloudwatch_event_rule" "book_registered_rule" {
  name        = "bookshelf-book-registered"
  description = "Captures BookRegistered events from the virtual bookshelf application"

  event_pattern = jsonencode({
    source      = [local.events.sources.books]
    detail-type = [local.events.names.book_registered]
  })
}

resource "aws_cloudwatch_event_rule" "loan_registered_rule" {
  name        = "bookshelf-loan-registered"
  description = "Captures LoanRegistered events from the virtual bookshelf application"

  event_pattern = jsonencode({
    source      = [local.events.sources.loans]
    detail-type = [local.events.names.loan_registered]
  })
}

resource "aws_cloudwatch_event_rule" "loan_returned_rule" {
  name        = "bookshelf-loan-returned"
  description = "Captures LoanReturned events from the virtual bookshelf application"

  event_pattern = jsonencode({
    source      = [local.events.sources.loans]
    detail-type = [local.events.names.loan_returned]
  })
}
