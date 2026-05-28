data "archive_file" "app" {
  type        = "zip"
  source_dir  = "${path.root}/dist"
  output_path = "${path.root}/app.zip"
}
