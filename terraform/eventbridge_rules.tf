resource "aws_cloudwatch_event_rule" "book_registered_rule" {
  name        = "bookshelf-book-registered"
  description = "Captures BookRegistered events from the virtual bookshelf application"

  event_pattern = jsonencode({
    source      = [local.events.sources.books]
    detail-type = [local.events.names.book_registered]
  })
}
