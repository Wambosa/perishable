variable "region" {
  default     = "us-east-1"
  description = "should only need to provide this value when deploying lambda to various regions"
}

variable "environment" {
  default     = "dev"
  description = "which aws account are we deploying to? (dev, prod)"
}

variable "database_pass" {
  default     = ""
  description = "required for lambda database access"
}

terraform {
  backend "s3" {
    acl    = "private"
    key    = "lambda/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "${var.region}"
}
