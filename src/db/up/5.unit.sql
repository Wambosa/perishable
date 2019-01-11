CREATE TABLE IF NOT EXISTS `unit` (
  `id` SERIAL NOT NULL COMMENT 'unique unit id',
  `name` VARCHAR(256) NOT NULL COMMENT 'friendly reference name',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'the user who registered the unit/product',
  `group_id` BIGINT UNSIGNED NOT NULL COMMENT 'unit/product type/group reference',
  `desc` TEXT NULL COMMENT 'open text describing the unit/product',
  `weight` FLOAT UNSIGNED NULL COMMENT 'the mass of the unit in grams',
  `length` FLOAT UNSIGNED NULL COMMENT 'volume measurement',
  `width` FLOAT UNSIGNED NULL COMMENT 'volume measurement',
  `height` FLOAT UNSIGNED NULL COMMENT 'volume measurement',
  `expire` DATETIME NULL COMMENT 'when unit begins to smell bad',

  `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES user(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY (group_id) REFERENCES unit_group(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
)

ENGINE = InnoDB
DEFAULT CHARSET = utf8;