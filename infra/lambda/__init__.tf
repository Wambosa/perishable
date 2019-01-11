data "aws_caller_identity" "current" {}

data "aws_iam_role" "lambda_admin" {
  name = "lambda-admin"
}

data "aws_vpc" "perishable_vpc" {
  filter {
    name   = "tag:Name"
    values = ["perishable-vpc"]
  }
}

data "aws_subnet_ids" "perishable" {
  vpc_id = "${data.aws_vpc.perishable_vpc.id}"

  tags = {
    for = "lambda"
  }
}

data "aws_security_group" "lambda" {
  filter {
    name   = "tag:Name"
    values = ["perishable-lambda"]
  }
}

data "aws_security_group" "team_ssh" {
  filter {
    name   = "tag:Name"
    values = ["team-ssh"]
  }
}

data "aws_rds_cluster" "perishable" {
  cluster_identifier = "perishable-aurora"
}

data "aws_api_gateway_rest_api" "perishable" {
  name = "perishable"
}
