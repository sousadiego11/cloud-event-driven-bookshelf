resource "aws_s3_bucket" "lambdas" {
  bucket = "bookshelf-lambdas-bucket"

  tags = {
    Name        = "Bookshelf Lambdas Bucket"
    Environment = "Production"
  }
}
