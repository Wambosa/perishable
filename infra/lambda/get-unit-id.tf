resource "aws_lambda_function" "get_unit_id" {
  filename         = "${path.module}/.build/get-unit-id.zip"
  source_code_hash = "${data.archive_file.get_unit_id.output_base64sha256}"
  function_name    = "get-unit-id"
  handler          = "index.handler"
  role             = "${data.aws_iam_role.lambda_admin.arn}"
  runtime          = "nodejs8.10"
  timeout          = 10

  vpc_config {
    subnet_ids         = ["${data.aws_subnet_ids.perishable.ids}"]
    security_group_ids = ["${data.aws_security_group.lambda.id}"]
  }

  environment {
    variables = {
      DATABASE_HOST = "${data.aws_rds_cluster.perishable.endpoint}"
      DATABASE_USER = "mom"
      DATABASE_NAME = "perishable"
      DATABASE_PASS = "${var.database_pass}"
    }
  }
}

resource "aws_lambda_permission" "get_unit_id" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.get_unit_id.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${data.aws_api_gateway_rest_api.perishable.id}/*/*/*"
}

data "archive_file" "get_unit_id" {
  type        = "zip"
  source_dir  = "${path.module}/.build/get-unit-id"
  output_path = "${path.module}/.build/get-unit-id.zip"
}
