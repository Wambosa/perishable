resource "aws_vpc" "perishable_vpc" {
  cidr_block           = "172.30.0.0/16"
  enable_dns_hostnames = true

  tags {
    Name = "perishable-vpc"
  }
}

resource "aws_internet_gateway" "perishable" {
  vpc_id = "${aws_vpc.perishable_vpc.id}"

  tags {
    Name = "perishable"
  }
}

resource "aws_default_route_table" "perishable_internet_route" {
  default_route_table_id = "${aws_vpc.perishable_vpc.default_route_table_id}"

  route {
    gateway_id = "${aws_internet_gateway.perishable.id}"
    cidr_block = "0.0.0.0/0"
  }
}

resource "aws_subnet" "us_east_1a" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.0.0/24"
  availability_zone = "us-east-1a"

  tags {
    Name = "perishable-vpc-us-east-1a"
  }
}

resource "aws_subnet" "us_east_1b" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.1.0/24"
  availability_zone = "us-east-1b"

  tags {
    Name = "perishable-vpc-us-east-1b"
  }
}

resource "aws_subnet" "us_east_1c" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.2.0/24"
  availability_zone = "us-east-1c"

  tags {
    Name = "perishable-vpc-us-east-1c"
  }
}

resource "aws_subnet" "us_east_1d" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.3.0/24"
  availability_zone = "us-east-1d"

  tags {
    Name = "perishable-vpc-us-east-1d"
  }
}

resource "aws_subnet" "us_east_1e" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.4.0/24"
  availability_zone = "us-east-1e"

  tags {
    Name = "perishable-vpc-us-east-1e"
  }
}

resource "aws_subnet" "us_east_1f" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.5.0/24"
  availability_zone = "us-east-1f"

  tags {
    Name = "perishable-vpc-us-east-1f"
  }
}

resource "aws_eip" "perishable" {
  vpc = true
}

resource "aws_nat_gateway" "perishable" {
  allocation_id = "${aws_eip.perishable.id}"
  subnet_id     = "${aws_subnet.lambda_us_east_1a_igw.id}"

  tags = {
    Name = "perishable lambda NAT"
  }
}

resource "aws_route_table" "lambda_nat" {
  vpc_id = "${aws_vpc.perishable_vpc.id}"

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.perishable.id}"
  }

  tags = {
    Name = "perishable lambda NAT route"
  }
}

resource "aws_route_table_association" "lambda_us_east_1b_nat" {
  subnet_id      = "${aws_subnet.lambda_us_east_1b_nat.id}"
  route_table_id = "${aws_route_table.lambda_nat.id}"
}

resource "aws_route_table_association" "lambda_us_east_1c_nat" {
  subnet_id      = "${aws_subnet.lambda_us_east_1c_nat.id}"
  route_table_id = "${aws_route_table.lambda_nat.id}"
}

resource "aws_route_table_association" "lambda_us_east_1d_nat" {
  subnet_id      = "${aws_subnet.lambda_us_east_1d_nat.id}"
  route_table_id = "${aws_route_table.lambda_nat.id}"
}

resource "aws_route_table_association" "lambda_us_east_1a_igw" {
  subnet_id      = "${aws_subnet.lambda_us_east_1a_igw.id}"
  route_table_id = "${aws_default_route_table.perishable_internet_route.id}"
}

resource "aws_subnet" "lambda_us_east_1a_igw" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.10.0/24"
  availability_zone = "us-east-1a"

  tags {
    Name = "perishable-us-east-1a-igw"
  }
}

resource "aws_subnet" "lambda_us_east_1b_nat" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.11.0/24"
  availability_zone = "us-east-1b"

  tags {
    Name = "perishable-us-east-1b-nat"
    for  = "lambda"
  }
}

resource "aws_subnet" "lambda_us_east_1c_nat" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.12.0/24"
  availability_zone = "us-east-1c"

  tags {
    Name = "perishable-us-east-1c-nat"
    for  = "lambda"
  }
}

resource "aws_subnet" "lambda_us_east_1d_nat" {
  vpc_id            = "${aws_vpc.perishable_vpc.id}"
  cidr_block        = "172.30.13.0/24"
  availability_zone = "us-east-1d"

  tags {
    Name = "perishable-us-east-1d-nat"
    for  = "lambda"
  }
}
