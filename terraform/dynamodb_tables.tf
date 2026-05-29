resource "aws_dynamodb_table" "books" {
  name         = local.dynamodb.books.name
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
    name            = local.dynamodb.books.indexes.author_registered
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
    name            = local.dynamodb.books.indexes.isbn
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
  name         = local.dynamodb.loans.name
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
    name            = local.dynamodb.loans.indexes.cpf_registered
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
    name            = local.dynamodb.loans.indexes.book_registered
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

  global_secondary_index {
    name            = local.dynamodb.loans.indexes.book_by_cpf
    projection_type = "ALL"

    key_schema {
      attribute_name = "Cpf"
      key_type       = "HASH"
    }

    key_schema {
      attribute_name = "BookId"
      key_type       = "RANGE"
    }
  }

  tags = {
    Name        = "Bookshelf Loans Table"
    Environment = "Production"
  }
}

resource "aws_dynamodb_table" "inventory" {
  name         = local.dynamodb.inventory.name
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
    name            = local.dynamodb.inventory.indexes.book
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
  name         = local.dynamodb.notifications.name
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
    name            = local.dynamodb.notifications.indexes.idempotency_key
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
