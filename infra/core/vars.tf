variable "region" {
  default     = "us-east-1"
  description = "should only need to provide this value when deploying lambda to various regions"
}

variable "environment" {
  default     = "dev"
  description = "which aws account are we deploying to? (dev, prod)"
}

terraform {
  backend "s3" {
    acl    = "private"
    key    = "core/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "${var.region}"
}
