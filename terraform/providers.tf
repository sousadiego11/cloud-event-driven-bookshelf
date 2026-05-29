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

  cloud {

    organization = "bookshelf-api"

    workspaces {
      name = "api"
    }
  }

  required_version = ">= 1.14"
}
