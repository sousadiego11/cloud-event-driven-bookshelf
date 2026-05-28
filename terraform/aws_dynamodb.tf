resource "aws_dynamodb_table" "books" {
  name         = "bookshelf-books"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "Author"
    type = "S"
  }

  attribute {
    name = "Isbn"
    type = "S"
  }

  attribute {
    name = "RegisteredAt"
    type = "S"
  }

  global_secondary_index {
    name            = "bookshelf_author_registered_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "Author"
      key_type       = "HASH"
    }

    key_schema {
      attribute_name = "RegisteredAt"
      key_type       = "RANGE"
    }
  }

  global_secondary_index {
    name            = "bookshelf_isbn_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "Isbn"
      key_type       = "HASH"
    }
  }

  tags = {
    Name        = "Bookshelf Books Table"
    Environment = "Production"
  }
}

resource "aws_dynamodb_table" "loans" {
  name         = "bookshelf-loans"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "Cpf"
    type = "S"
  }

  attribute {
    name = "BookId"
    type = "S"
  }

  attribute {
    name = "RegisteredAt"
    type = "S"
  }

  global_secondary_index {
    name            = "bookshelf_cpf_registered_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "Cpf"
      key_type       = "HASH"
    }

    key_schema {
      attribute_name = "RegisteredAt"
      key_type       = "RANGE"
    }
  }

  global_secondary_index {
    name            = "bookshelf_book_registered_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "BookId"
      key_type       = "HASH"
    }

    key_schema {
      attribute_name = "RegisteredAt"
      key_type       = "RANGE"
    }
  }

  tags = {
    Name        = "Bookshelf Loans Table"
    Environment = "Production"
  }
}

resource "aws_dynamodb_table" "inventory" {
  name         = "bookshelf-inventory"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "BookId"
    type = "S"
  }

  global_secondary_index {
    name            = "bookshelf_inventory_book_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "BookId"
      key_type       = "HASH"
    }
  }

  tags = {
    Name        = "Bookshelf Inventory Table"
    Environment = "Production"
  }
}

resource "aws_dynamodb_table" "notifications" {
  name         = "bookshelf-notifications"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "IdempotencyKey"
    type = "S"
  }

  global_secondary_index {
    name            = "bookshelf_notification_idempotency_key_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "IdempotencyKey"
      key_type       = "HASH"
    }
  }

  tags = {
    Name        = "Bookshelf Notifications Table"
    Environment = "Production"
  }
}
