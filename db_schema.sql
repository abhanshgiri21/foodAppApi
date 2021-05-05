CREATE DATABASE IF NOT EXISTS food_app_tt CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

USE food_app_tt;

-- user table -> table with each row corresponding to each user.
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` int(11) unsigned AUTO_INCREMENT NOT NULL,
    `name` varchar(500) NOT NULL,
    `balance` decimal(10, 2) NOT NULL DEFAULT 0.00,
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- restaurants table -> table with each row corresponding to each restaurant
DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
    `id` int(11) unsigned AUTO_INCREMENT NOT NULL,
    `name` varchar(500) NOT NULL,
    `balance` decimal(10, 2) NOT NULL DEFAULT 0.00,
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- menu table -> table with each row corresponding to a menu item for a restaurant
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
    `id` int(11) unsigned AUTO_INCREMENT NOT NULL,
    `name` varchar(500) NOT NULL,
    `price` decimal(10, 2) NOT NULL DEFAULT 0.00,
    `restaurant` int(11) unsigned NOT NULL,
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`restaurant`) REFERENCES restaurants(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- opening_hours table -> table with each row depicting one opening hour for a given restaurant
DROP TABLE IF EXISTS `opening_hours`;
CREATE TABLE `opening_hours` (
    `id` int(11) unsigned AUTO_INCREMENT NOT NULL,
    `start` int(11) unsigned NOT NULL,
    `end` int(11) unsigned NOT NULL,
    `day` tinyint(3) unsigned NOT NULL,
    `restaurant` int(11) unsigned NOT NULL,
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`restaurant`) REFERENCES `restaurants`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- table contains the orders places by users on a restaurant
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
    `id` int(11) unsigned AUTO_INCREMENT NOT NULL,
    `user` int(11) unsigned NOT NULL,
    `restaurant` int(11) unsigned NOT NULL,
    `dish` int(11) unsigned NOT NULL,
    `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`restaurant`) REFERENCES `restaurants`(`id`),
    FOREIGN KEY (`user`) REFERENCES `users`(`id`),
    FOREIGN KEY (`dish`) REFERENCES `menu`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Add full text search for searching restaurants and menu by relevance

ALTER TABLE menu ADD FULLTEXT (name);

ALTER TABLE restaurants  ADD FULLTEXT (name);