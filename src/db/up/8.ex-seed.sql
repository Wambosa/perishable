-- some dummy values to prove out the concept of the system

INSERT INTO `org` (`name`)
VALUES
('Our Table Inc.'),
('Aldi');

INSERT INTO `user` (`name`, `email`, `hash`, `org_id`)
VALUES
('Jimmy Foulin', 'jfoul@ourtable.com', 'todo', 1),
('Andrew Fatson', 'aFatson@ourtable.com', 'todo', 1),
('Jennifer Allister', 'jallister@aldi.com', 'todo', 2),
('Crum Gallagher', 'cGallagher@aldi.com', 'todo', 2);

INSERT INTO `unit_group` (`name`, `user_id`, `org_id`, `desc`)
VALUES
('apple', 2, 1, 'Shiny red fruit that restores 5HP upon consumption.'),
('tomato', 4, 2, 'This variety consists of a lush foliage. It has a weaker stem. It produces lots of light green tomatoes of oblong shape about 2" long by 1" thick. Rated: This variety rates #2 in tomato yield as it makes up 9.25% of total fruit weight of all varieties. The fruit weight and plant weight are very comparable. The health scale indicates an average of 75.0% healthy leaves.'),
-- here is an example of a same/similar concept across orgs that we might later want to unify
('coffee', 1, 1, 'The shrub of the bedstraw family that yields the coffee seeds, two of which are contained in each red berry. Native to the Old World tropics, most coffee is grown in tropical America.'),
('java', 3, 2, 'Basically coffee. Restores 8FP upon consumption.'),
('fish', 1, 2, 'Hard to tell when these go bad, because they always smell poor. They live in the water and apparently liked to be eaten.');

INSERT INTO `unit` (`name`, `user_id`, `group_id`, `weight`, `expire`, `desc`)
VALUES
('red tomato crate', 3, 2, 2267.96, null, 'found behind my desk, must be a part of last weeks shipment - whoops.'),
('red tomato crate', 3, 2, 2268, '2019-01-31 00:00:00', null),
('blue tomato crate', 3, 2, 2260, '2020-01-31 00:00:00', 'Lucky loot box of tomatoes that have become infused with FP during transport.'),
('red tomato box', 3, 2, 453.59, '2019-01-31 00:00:00', 'Fell out of broken tomato crate'),
('blue tomato box', 3, 2, 452, '2020-01-29 00:00:00', 'Caught an employee smuggling this box out of the warehouse.'),
('apple bag', 1, 1, 300.42, '2019-01-18 00:00:00', null),
('coffee crate', 1, 3, 9001, '2019-01-18 00:00:00', 'Hurt my back lifting this unusually heavy crate of coffee'),
('crushed java bag', 3, 4, 200.11, '2023-05-01 00:00:00', null);

-- tomato and apple have color, and apple can have tree details, while tomato can have vine details

INSERT INTO `unit_ext` (`unit_id`, `ext`)
VALUES
(1, '{"vineCondition": "meh"}'),
(2, '{"vineCondition": "great"}'),
(3, '{"color": "0000FF", "vineCondition": "superb"}'),
(4, '{"vineCondition": "okay"}'),
(5, '{"color": "0000EE", "vineCondition": "superb"}'),
(6, '{"treeId": 345, "taste": "sour"}'),
(7, '{"cuppingScore": 55, "treeType": "Birch"}'),
(8, '{"rating": "C"}');

-- rule_names here aliased to actual methods in code
-- this decoupling gives us the ability to use async methods if that ever becomes a need
-- addionally this is a language agnostic way of tracking the desires of the user(s)
-- also the rules can be managed by the creator of the unit(s)
-- these will only apply to the custom props defined in unit_ext, since the common properties will all have the same known validation
INSERT INTO `rule_map` (`rule_name`, `unit_group_id`, `key`)
VALUES
('required', 1, 'treeId', null),
('isInteger', 1, 'treeId', null),
('required', 2, 'vineCondition', null),
('isHexadecimal', 2, 'color', null),
('isInteger', 3, 'cuppingScore', null),
('inRange', 3, 'cuppingScore', '{"min": 1, "max": 100}'),
('required', 3, 'treeType', null),
('required', 4, 'rating', null),
('isLetter', 4, 'rating', null),
('required', 5, 'catchDate', null),
('isDate', 5, 'catchDate', null),
('isInteger', 5, 'vesselId', null);