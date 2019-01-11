CREATE TABLE IF NOT EXISTS `rule_map` (
  `rule_name` VARCHAR(256) NOT NULL COMMENT 'the name of a prebuilt rule',
  `unit_group_id` BIGINT UNSIGNED NOT NULL COMMENT 'which grouping should this validation rule apply to',
  `key` VARCHAR(256) NOT NULL COMMENT 'custom key/property to apply validation rule to',
  `params` JSON NULL COMMENT 'parameter object to pass into the rule at runtime',

   FOREIGN KEY (unit_group_id) REFERENCES unit_group(id)
     ON UPDATE RESTRICT ON DELETE RESTRICT
)

ENGINE = InnoDB
DEFAULT CHARSET = utf8;