data "aws_caller_identity" "current" {}

data "aws_vpc" "perishable_vpc" {
  filter {
    name   = "tag:Name"
    values = ["perishable-vpc"]
  }
}

data "aws_subnet_ids" "perishable" {
  vpc_id = "${data.aws_vpc.perishable_vpc.id}"
}

data "aws_security_group" "team_ssh" {
  filter {
    name   = "tag:Name"
    values = ["team-ssh"]
  }
}

data "aws_security_group" "ec2" {
  filter {
    name   = "tag:Name"
    values = ["perishable-ec2"]
  }
}

data "aws_security_group" "perishable_rds" {
  filter {
    name   = "tag:Name"
    values = ["perishable-rds"]
  }
}
