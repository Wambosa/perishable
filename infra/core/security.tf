resource "aws_security_group" "team_access" {
  lifecycle {
    create_before_destroy = true
  }

  name        = "team-ssh"
  description = "Allows team access to backend resources"
  vpc_id      = "${aws_vpc.perishable_vpc.id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "allow all outbound traffic"
  }

  tags {
    Name = "team-ssh"
  }
}

resource "aws_security_group_rule" "shon_ssh" {
  type              = "ingress"
  from_port         = "22"
  to_port           = "22"
  protocol          = "tcp"
  cidr_blocks       = ["52.144.109.80/30"]
  security_group_id = "${aws_security_group.team_access.id}"
  description       = "shon home ssh"
}

resource "aws_security_group" "perishable_ec2" {
  lifecycle {
    create_before_destroy = true
  }

  name        = "perishable-ec2"
  description = "ec2 network group"
  vpc_id      = "${aws_vpc.perishable_vpc.id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "allow all outbound traffic"
  }

  tags {
    Name = "perishable-ec2"
  }
}

# to address ingress bug https://github.com/hashicorp/terraform/issues/5025
resource "aws_security_group_rule" "perishable_ec2_self" {
  type                     = "ingress"
  from_port                = "0"
  to_port                  = "0"
  protocol                 = "-1"
  security_group_id        = "${aws_security_group.perishable_ec2.id}"
  source_security_group_id = "${aws_security_group.perishable_ec2.id}"
  description              = "allow all traffic from within same ec2 security group"
}

resource "aws_security_group_rule" "perishable_ec2_rds" {
  type                     = "ingress"
  from_port                = "0"
  to_port                  = "0"
  protocol                 = "-1"
  security_group_id        = "${aws_security_group.perishable_ec2.id}"
  source_security_group_id = "${aws_security_group.perishable_rds.id}"
  description              = "allow all database traffic to internal ec2 instances"
}

resource "aws_security_group" "perishable_lambda" {
  lifecycle {
    create_before_destroy = true
  }

  name        = "perishable-lambda"
  description = "lambda network group"
  vpc_id      = "${aws_vpc.perishable_vpc.id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "allow all outbound traffic"
  }

  ingress {
    from_port   = "0"
    to_port     = "0"
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "allow all return traffic to internal lambda instances"
  }

  tags {
    Name = "perishable-lambda"
  }
}

resource "aws_security_group" "perishable_rds" {
  lifecycle {
    create_before_destroy = true
  }

  name        = "perishable-rds"
  description = "strict network database access rules"
  vpc_id      = "${aws_vpc.perishable_vpc.id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "allow all outbound traffic"
  }

  ingress {
    from_port       = "3306"
    to_port         = "3306"
    protocol        = "tcp"
    security_groups = ["${aws_security_group.perishable_lambda.id}", "${aws_security_group.perishable_ec2.id}"]
    description     = "only allow mysql access from known security groups"
  }

  tags {
    Name = "perishable-rds"
  }
}
