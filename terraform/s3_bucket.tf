resource "aws_s3_bucket" "lambdas" {
  bucket = local.s3.buckets.lambdas
}
