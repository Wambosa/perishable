data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_launch_configuration" "db_proxy" {
  lifecycle {
    create_before_destroy = true
  }

  name_prefix                 = "db-proxy-"
  associate_public_ip_address = true
  image_id                    = "${data.aws_ami.ubuntu.id}"
  instance_type               = "t2.nano"
  key_name                    = "perishable"
  iam_instance_profile        = "ec2-proxy"
  security_groups             = ["${data.aws_security_group.ec2.id}", "${data.aws_security_group.team_ssh.id}"]
  enable_monitoring           = false

  root_block_device {
    volume_type           = "gp2"
    volume_size           = 8
    delete_on_termination = true
  }
}

resource "aws_autoscaling_group" "db_proxy" {
  name                 = "db-proxy"
  vpc_zone_identifier  = ["${data.aws_subnet_ids.perishable.ids}"]
  launch_configuration = "${aws_launch_configuration.db_proxy.id}"
  min_size             = "0"
  max_size             = "1"
  desired_capacity     = "1"
  termination_policies = ["OldestLaunchConfiguration", "ClosestToNextInstanceHour", "Default"]

  tag {
    key                 = "Name"
    value               = "db-proxy"
    propagate_at_launch = true
  }
}
