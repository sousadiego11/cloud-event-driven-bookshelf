resource "aws_s3_bucket" "lambdas" {
  bucket = "cede-lambdas-bucket"

  tags = {
    Name        = "CEDE Lambdas Bucket"
    Environment = "Production"
  }
}
