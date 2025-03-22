-- Custom SQL migration file, put you code below! --


-- CREATE TABLE `stock` (
-- 	`id` text PRIMARY KEY NOT NULL,
-- 	`name` text NOT NULL,
-- 	`desc` text NOT NULL,
-- 	`price` integer NOT NULL,
-- 	`stock` integer DEFAULT 0 NOT NULL
-- );



INSERT INTO `stock` (`id`, `name`, `desc`, `price`, `stock`)
VALUES 
('3', 'Secret', '', 100, 20),
('4', 'Kebab', '', 200, 6),
('5', 'Billet de soirée', '', 1000, 5);
