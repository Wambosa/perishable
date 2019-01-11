-- notes
-- the org_id seperates who created the concept 
-- since varying orgs may have near or far ideas as to what a particular perishable type is
-- later on, some analysis can be done to map the various interpretations that orgs have to then unify them
-- as opposed to attempting to police what a concept is to all orgs or worse, bombard the user with terminology from another org that is unfamiliar

CREATE TABLE IF NOT EXISTS `unit_group` (
  `id` SERIAL NOT NULL COMMENT 'unique unit grouping id',
  `name` VARCHAR(256) NOT NULL COMMENT 'friendly reference name',
  `desc` TEXT NULL COMMENT 'open text describing the group/type',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'the creator of this group',
  `org_id` BIGINT UNSIGNED NOT NULL COMMENT 'company that utilizes this grouping',

  `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES user(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY (org_id) REFERENCES org(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
)

ENGINE = InnoDB
DEFAULT CHARSET = utf8;