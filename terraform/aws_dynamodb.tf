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

  tags = {
    Name        = "Bookshelf Books Table"
    Environment = "Production"
  }
}
