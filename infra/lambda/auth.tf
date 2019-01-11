resource "aws_lambda_function" "auth" {
  filename         = "${path.module}/.build/auth.zip"
  source_code_hash = "${data.archive_file.auth.output_base64sha256}"
  function_name    = "auth"
  handler          = "method.handler"
  role             = "${data.aws_iam_role.lambda_admin.arn}"
  runtime          = "nodejs8.10"
  timeout          = 5

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

resource "aws_lambda_permission" "auth" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.auth.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${data.aws_api_gateway_rest_api.perishable.id}/authorizers/*"
}

data "archive_file" "auth" {
  type        = "zip"
  source_dir  = "${path.module}/.build/auth"
  output_path = "${path.module}/.build/auth.zip"
}
