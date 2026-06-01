locals {
  queues = {
    notify_library_book_registered = {
      name = "bookshelf-notify-library-book-registered"
    }
    notify_library_loan_registered = {
      name = "bookshelf-notify-library-loan-registered"
    }
    notify_library_loan_returned = {
      name = "bookshelf-notify-library-loan-returned"
    }
    analyze_demand_loan_registered = {
      name = "bookshelf-analyze-demand-loan-registered"
    }
  }

  lambdas = {
    register_book = {
      function_name = "bookshelf-register-book"
      handler       = "aws-apigateway/register_book.handler"
    }
    register_loan = {
      function_name = "bookshelf-register-loan"
      handler       = "aws-apigateway/register_loan.handler"
    }
    return_loan = {
      function_name = "bookshelf-return-loan"
      handler       = "aws-apigateway/return_loan.handler"
    }
    notify_library_book_registered = {
      function_name = "bookshelf-notify-library-book-registered"
      handler       = "aws-sqs/notify_library_book_registered.handler"
    }
    notify_library_loan_registered = {
      function_name = "bookshelf-notify-library-loan-registered"
      handler       = "aws-sqs/notify_library_loan_registered.handler"
    }
    notify_library_loan_returned = {
      function_name = "bookshelf-notify-library-loan-returned"
      handler       = "aws-sqs/notify_library_loan_returned.handler"
    }
    analyze_demand_loan_registered = {
      function_name = "bookshelf-analyze-demand-loan-registered"
      handler       = "aws-sqs/analyze_demand_loan_registered.handler"
    }
  }

  events = {
    sources = {
      books = "bookshelf.books"
      loans = "bookshelf.loans"
    }
    names = {
      book_registered = "BookRegistered"
      loan_registered = "LoanRegistered"
      loan_returned = "LoanReturned"
    }
  }

  dynamodb = {
    books = {
      name = "bookshelf-books"
      indexes = {
        author_registered = "bookshelf_author_registered_idx"
        isbn              = "bookshelf_isbn_idx"
      }
    }
    loans = {
      name = "bookshelf-loans"
      indexes = {
        cpf_registered      = "bookshelf_cpf_registered_idx"
        book_registered     = "bookshelf_book_registered_idx"
        book_by_cpf         = "bookshelf_book_by_cpf_idx"
        due_date_registered = "bookshelf_due_date_registered_idx"
        returned_at         = "bookshelf_returned_at_idx"
      }
    }
    inventory = {
      name = "bookshelf-inventory"
      indexes = {
        book = "bookshelf_inventory_book_idx"
      }
    }
    notifications = {
      name = "bookshelf-notifications"
      indexes = {
        idempotency_key = "bookshelf_notification_idempotency_key_idx"
      }
    }
  }

  apigateway = {
    api_name   = "books-api"
    stage_name = "dev"
    paths = {
      books = "books"
      loans = "loans"
      return_loan = "return"
    }
  }

  s3 = {
    buckets = {
      lambdas = "bookshelf-lambda-artifacts"
    }
  }
}
