locals {
  queues = {
    notify_library_book_registered = {
      name = "bookshelf-notify-library-book-registered"
    }
    initialize_inventory_book_registered = {
      name = "bookshelf-initialize-inventory-book-registered"
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
    notify_library_book_registered = {
      function_name = "bookshelf-notify-library-book-registered"
      handler       = "aws-sqs/notify_library_book_registered.handler"
    }
    initialize_inventory_book_registered = {
      function_name = "bookshelf-initialize-inventory-book-registered"
      handler       = "aws-sqs/initialize_inventory_book_registered.handler"
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
        cpf_registered  = "bookshelf_cpf_registered_idx"
        book_registered = "bookshelf_book_registered_idx"
        book_by_cpf     = "bookshelf_book_by_cpf_idx"
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
    }
  }

  s3 = {
    buckets = {
      lambdas = "bookshelf-lambda-artifacts"
    }
  }
}
