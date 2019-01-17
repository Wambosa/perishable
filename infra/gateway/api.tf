data "template_file" "api_spec_integrations" {
  template = "${file("${path.module}/oas-integrations.yml")}"

  vars {
    region    = "${var.region}"
    accountId = "${data.aws_caller_identity.current.account_id}"
  }
}

resource "aws_api_gateway_rest_api" "perishable" {
  name        = "perishable"
  description = "perishable unit tracking api"

  body = "${data.template_file.api_spec_integrations.rendered}"

  # api_key_source = "AUTHORIZER"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "perishable_v1" {
  depends_on  = ["aws_api_gateway_rest_api.perishable"]
  rest_api_id = "${aws_api_gateway_rest_api.perishable.id}"
  stage_name  = "v1"
}

resource "aws_api_gateway_usage_plan" "perishable" {
  name        = "limited usage plan"
  description = "enough to demo the concept without making a feather out of my wallet"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.perishable.id}"
    stage  = "${aws_api_gateway_deployment.perishable_v1.stage_name}"
  }

  quota_settings {
    limit  = 1000
    period = "DAY"
  }

  throttle_settings {
    burst_limit = 50
    rate_limit  = 50
  }
}

resource "aws_api_gateway_api_key" "perishable_demo" {
  name = "perishable-demo"
}

resource "aws_api_gateway_usage_plan_key" "perishable_demo" {
  key_id        = "${aws_api_gateway_api_key.perishable_demo.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.perishable.id}"
}

resource "aws_api_gateway_api_key" "perishable_demo_2" {
  name = "perishable-demo-2"
}

resource "aws_api_gateway_usage_plan_key" "perishable_demo_2" {
  key_id        = "${aws_api_gateway_api_key.perishable_demo_2.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.perishable.id}"
}
