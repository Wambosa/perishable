resource "aws_iam_role" "lambda_admin" {
  name               = "lambda-admin"
  assume_role_policy = "${file("./policy/assume_role_lambda_admin.json")}"
}

resource "aws_iam_policy" "lambda_admin" {
  name        = "lambda-admin"
  description = "give lambda access to the resources we need"
  policy      = "${file("./policy/lambda_admin.json")}"
}

resource "aws_iam_role_policy_attachment" "lambda_admin" {
  role       = "${aws_iam_role.lambda_admin.name}"
  policy_arn = "${aws_iam_policy.lambda_admin.arn}"
}

resource "aws_iam_role" "ec2_proxy" {
  name               = "ec2-proxy"
  assume_role_policy = "${file("./policy/assume_role_ec2_proxy.json")}"
}

resource "aws_iam_policy" "ec2_proxy" {
  name        = "ec2-proxy"
  description = "give proxy ec2 basic rights for debugging and ssh"
  policy      = "${file("./policy/ec2_proxy.json")}"
}

resource "aws_iam_role_policy_attachment" "ec2_proxy" {
  role       = "${aws_iam_role.ec2_proxy.name}"
  policy_arn = "${aws_iam_policy.ec2_proxy.arn}"
}

resource "aws_iam_instance_profile" "ec2_proxy" {
  name = "${aws_iam_role.ec2_proxy.name}"
  role = "${aws_iam_role.ec2_proxy.name}"
}
