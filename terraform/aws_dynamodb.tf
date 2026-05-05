resource "aws_dynamodb_table" "orders" {
  name         = "cede-orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"
  range_key    = "CreatedAt"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "Status"
    type = "S"
  }

  attribute {
    name = "CreatedAt"
    type = "S"
  }

  attribute {
    name = "UpdatedAt"
    type = "S"
  }

  global_secondary_index {
    name            = "cede_userid_created_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "UserId"
      key_type       = "HASH"
    }
    key_schema {
      attribute_name = "CreatedAt"
      key_type       = "RANGE"
    }
  }

  global_secondary_index {
    name            = "cede_userid_updated_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "UserId"
      key_type       = "HASH"
    }
    key_schema {
      attribute_name = "UpdatedAt"
      key_type       = "RANGE"
    }
  }

  global_secondary_index {
    name            = "cede_userid_status_idx"
    projection_type = "ALL"

    key_schema {
      attribute_name = "UserId"
      key_type       = "HASH"
    }
    key_schema {
      attribute_name = "Status"
      key_type       = "RANGE"
    }
  }

  tags = {
    Name        = "CEDE Orders Table"
    Environment = "Production"
  }
}
