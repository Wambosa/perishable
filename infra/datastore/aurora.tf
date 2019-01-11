resource "aws_db_subnet_group" "perishable" {
  name       = "perishable-subnet-group"
  subnet_ids = ["${data.aws_subnet_ids.perishable.ids}"]

  tags {
    Name = "perishable-subnet-group"
  }
}

resource "aws_rds_cluster" "perishable_aurora" {
  cluster_identifier        = "perishable-aurora"
  engine                    = "aurora-mysql"
  engine_version            = "5.7.12"
  database_name             = "perishable"
  master_username           = "${var.database_user}"
  master_password           = "${var.database_pass}"
  db_subnet_group_name      = "${aws_db_subnet_group.perishable.name}"
  vpc_security_group_ids    = ["${data.aws_security_group.perishable_rds.id}"]
  backup_retention_period   = 1
  skip_final_snapshot       = true
  final_snapshot_identifier = "perishable-aurora-pre-delete"
  apply_immediately         = true
}

resource "aws_rds_cluster_instance" "perishable_aurora" {
  count              = 1
  identifier         = "perishable-aurora-${count.index}"
  cluster_identifier = "${aws_rds_cluster.perishable_aurora.id}"
  instance_class     = "db.t2.small"
  engine             = "aurora-mysql"
}
