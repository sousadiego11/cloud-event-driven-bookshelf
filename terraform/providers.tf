terraform {
  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7.0"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.36.0"
    }
  }

  required_version = ">= 1.14"
}
