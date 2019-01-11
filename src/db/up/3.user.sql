CREATE TABLE IF NOT EXISTS `user` (
  `id` SERIAL NOT NULL COMMENT 'unique user id',
  `name` VARCHAR(256) NOT NULL COMMENT 'friendly user name',
  `email` VARCHAR(512) NULL COMMENT 'client auth account name',
  `apikey` VARCHAR(128) NULL COMMENT 'simple client identifier',
  `org_id` BIGINT UNSIGNED NOT NULL COMMENT 'company that this user belongs to',

  `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  FOREIGN KEY (org_id) REFERENCES org(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
)

ENGINE = InnoDB
DEFAULT CHARSET = utf8;

CREATE UNIQUE INDEX apikey_index ON user (apikey);