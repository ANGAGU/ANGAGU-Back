

CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `birth` date NOT NULL,
  `phone_number` varchar(45) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `idx_UNIQUE` (`id`),
  UNIQUE KEY `phone_number_UNIQUE` (`phone_number`)
);

CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_id` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `company_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone_number` varchar(45) NOT NULL,
  `business_number` varchar(45) NOT NULL,
  `account_number` varchar(45) DEFAULT NULL,
  `account_holder` varchar(45) DEFAULT NULL,
  `account_bank` varchar(45) DEFAULT NULL,
  `is_approve` tinyint NOT NULL DEFAULT '0',
  `is_block` tinyint NOT NULL DEFAULT '0',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `business_number_UNIQUE` (`business_number`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `name_UNIQUE` (`company_name`),
  UNIQUE KEY `account_id_UNIQUE` (`account_id`)
);

CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `description_url` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `price` varchar(45) NOT NULL,
  `stock` int NOT NULL DEFAULT '-1',
  `sell_count` int NOT NULL DEFAULT '0',
  `view_count` int NOT NULL DEFAULT '0',
  `delivery_charge` int NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `free_delivery_condition` varchar(45) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);

CREATE TABLE `product_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(45) NOT NULL,
  `image_order` varchar(45) NOT NULL DEFAULT '0',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);

