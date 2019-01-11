variable "region" {
  default     = "us-east-1"
  description = "should only need to provide this value when deploying lambda to various regions"
}

variable "environment" {
  default     = "dev"
  description = "which aws account are we deploying to? (dev, prod)"
}

variable "database_user" {
  default     = "mom"
  description = "default admin database user"
}

variable "database_pass" {
  default     = ""
  description = "required to set up a new database"
}

terraform {
  backend "s3" {
    acl    = "private"
    key    = "datastore/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "${var.region}"
}
