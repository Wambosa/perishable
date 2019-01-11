resource "aws_secretsmanager_secret" "database_password" {
  name        = "/database/password"
  description = "password to mysql database"
}

resource "aws_secretsmanager_secret_version" "database_password" {
  secret_id     = "${aws_secretsmanager_secret.database_password.id}"
  secret_string = "${var.database_pass}"
}
