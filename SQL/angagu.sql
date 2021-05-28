-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: angagu
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `recipient` varchar(45) NOT NULL,
  `road` varchar(45) DEFAULT NULL,
  `land` varchar(45) DEFAULT NULL,
  `detail` varchar(45) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('minjae','1234','2021-04-30 12:10:53','2021-04-30 12:10:53');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `board_id` int NOT NULL,
  `content` varchar(500) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `title` varchar(45) NOT NULL,
  `content` varchar(500) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `count` int NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `big` varchar(45) NOT NULL,
  `small` varchar(45) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(100) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone_number` varchar(45) NOT NULL,
  `business_number` varchar(45) DEFAULT NULL,
  `account_number` varchar(45) NOT NULL,
  `account_holder` varchar(45) NOT NULL,
  `account_bank` varchar(45) NOT NULL,
  `is_approve` tinyint NOT NULL DEFAULT '0',
  `is_block` tinyint NOT NULL DEFAULT '0',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `business_number_UNIQUE` (`business_number`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'1234','company_name','company@gmail.com','123456789','123456789','123456789','김회사','국민',1,0,'2021-04-11 03:40:10','2021-04-11 03:40:10'),(4,'test','test company','cmpany@gmail.com','12312341234','1256456415','865456564564','김회사','국민은행',0,0,'2021-04-27 18:53:58','2021-04-27 18:53:58'),(17,'test','test company','naver@gmail.com','12312341234','1256415','8654565564','김회사','국민은행',0,0,'2021-04-27 19:05:25','2021-04-27 19:05:25');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(45) NOT NULL,
  `birth` date NOT NULL,
  `address_id` int DEFAULT NULL,
  `phone_number` varchar(45) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `idx_UNIQUE` (`id`),
  UNIQUE KEY `address_id_UNIQUE` (`address_id`)
  UNIQUE KEY `phone_number_UNIQUE` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'minjaec@ajou.ac.kr','1234','조민재','1997-04-05','01051172407','2021-04-07 05:37:37','2021-04-07 05:37:37'),(2,'test@naver.com','test','whalswo','1997-04-05','01055559999','2021-04-27 19:27:27','2021-04-27 19:27:27');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `company_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `import_1` varchar(45) NOT NULL,
  `import_2` varchar(45) NOT NULL,
  `count` int NOT NULL,
  `price` int NOT NULL,
  `address_id` int NOT NULL,
  `delivery_number` varchar(45) DEFAULT NULL,
  `review_id` int DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,1,1,1,1,0,111111,0,'상품준비중',NULL,NULL,'2021-04-14 11:13:45','2021-04-14 11:13:45'),(2,2,1,1,2,0,222222,0,'상품준비중',NULL,NULL,'2021-04-14 11:24:37','2021-04-14 11:24:37');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `description_url` varchar(200) NOT NULL,
  `thumb_url` varchar(200) NOT NULL,
  `3d_model_url` varchar(45) DEFAULT NULL,
  `description` varchar(300) NOT NULL,
  `name` varchar(45) NOT NULL,
  `price` int NOT NULL,
  `stock` int NOT NULL DEFAULT '-1',
  `sell_count` int NOT NULL DEFAULT '0',
  `view_count` int NOT NULL DEFAULT '0',
  `delivery_charge` int NOT NULL,
  `free_delivery_condition` varchar(45) DEFAULT NULL,
  `is_approve` tinyint NOT NULL DEFAULT '0',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'product/desc/UBill5Imv','product/thumb/HyV_GXzk-i','test url','updated description','updated name',100000000,11111,0,14,2222222,NULL,1,'2021-04-18 04:14:22','2021-05-02 07:34:40'),(2,1,'descriptionUrl','thumbUrl',NULL,'description','desk',50000,10,0,0,3000,NULL,0,'2021-04-18 04:16:49','2021-04-18 04:16:49'),(4,1,'product/desc/p4Ll3RGnM','product/thumb/l5m-1Bf79v',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:03:49','2021-04-18 13:03:49'),(5,1,'product/desc/QwXyRINFJ','product/thumb/VCzaj68v6L',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:06:08','2021-04-18 13:06:08'),(6,1,'product/desc/a42IZAmCd','product/thumb/Ee4kQtkEIK',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:06:40','2021-04-18 13:06:40'),(7,1,'product/desc/N3dEp2g05','product/thumb/7Ru9yvmVl8',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:26:09','2021-04-18 13:26:09'),(8,1,'product/desc/8ruabZ3fc','product/thumb/G7zz1ZNQ1V',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:26:46','2021-04-18 13:26:46'),(9,1,'product/desc/0B9CGDuG4','product/thumb/_BUmTxvIsx',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:27:45','2021-04-18 13:27:45'),(10,1,'product/desc/7kHW38DJ9','product/thumb/H8fYQ4IIl5',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:28:44','2021-04-18 13:28:44'),(11,1,'product/desc/7PBJCEFeU','product/thumb/dyQYALMx8x',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:30:55','2021-04-18 13:30:55'),(16,1,'product/desc/E-WomFZIa','product/thumb/dqWrIGwe_r',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:35:38','2021-04-18 13:35:38'),(17,1,'product/desc/Z1WWC7--U','product/thumb/yKzVGRfRjo',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:37:41','2021-04-18 13:37:41'),(18,1,'product/desc/uA0JypVfM','product/thumb/ZkNjXoDatm',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:44:00','2021-04-18 13:44:00'),(19,1,'product/desc/yv8RW4cFN','product/thumb/3jKxsUK_5F',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:44:31','2021-04-18 13:44:31'),(27,1,'product/desc/PhE3CoQQq','product/thumb/l5y7Z1fH9t',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:48:52','2021-04-18 13:48:52'),(28,1,'product/desc/ZVGauSGG1','product/thumb/4CxAi7Zg-2',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:49:33','2021-04-18 13:49:33'),(29,1,'product/desc/VaWuMXkJg','product/thumb/PNrAYgLTTF',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:55:35','2021-04-18 13:55:35'),(30,1,'product/desc/prLEeVSre','product/thumb/oH3k1jwq3Y',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 13:55:44','2021-04-18 13:55:44'),(31,1,'product/desc/-8Waq9RXA','product/thumb/KLW3vQPlE7',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:00:54','2021-04-18 14:00:54'),(32,1,'product/desc/Rn36yThHK','product/thumb/-oms3RWDBt',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:01:18','2021-04-18 14:01:18'),(33,1,'product/desc/TBFeDokGC','product/thumb/XBvAYFpWnI',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:01:48','2021-04-18 14:01:48'),(34,1,'product/desc/QYO2TaLsQ','product/thumb/f7L_ujx5L3',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:02:30','2021-04-18 14:02:30'),(35,1,'product/desc/xDiSiy9eB','product/thumb/enN5RQCBFl',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:04:13','2021-04-18 14:04:13'),(36,1,'product/desc/IeAFQErY5','product/thumb/pqlB9PhTn7',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:13:20','2021-04-18 14:13:20'),(37,1,'product/desc/etFtGdeaU','product/thumb/bW7pYf0MGV',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:19:57','2021-04-18 14:19:57'),(38,1,'product/desc/yk_HVz7P4','product/thumb/xJUFBQ-xqY',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:20:31','2021-04-18 14:20:31'),(51,1,'product/desc/gj3_Hi9-I','product/thumb/1HQRgV0_EL',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:32:40','2021-04-18 14:32:40'),(52,1,'product/desc/yTytRzCbO','product/thumb/wKjl9CrLrv',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-18 14:34:12','2021-04-18 14:34:12'),(54,1,'product/desc/bUxmvQ2jt','product/thumb/fr_KkPDSjT',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-27 13:18:18','2021-04-27 13:18:18'),(55,1,'product/desc/MEIb3soUr','product/thumb/373Vb8hfKs',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-27 13:20:54','2021-04-27 13:20:54'),(56,1,'product/desc/-gswZw4xT','product/thumb/7wRJSA-ipx',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-27 13:40:03','2021-04-27 13:40:03'),(57,1,'product/desc/cLmi15syW','product/thumb/EntVd4eZJC',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-27 13:48:34','2021-04-27 13:48:34'),(58,1,'product/desc/VrBubbiTj','product/thumb/InOkGe_xSN',NULL,'updated description','updated name',100000,133,0,0,100000,NULL,0,'2021-04-27 13:52:22','2021-04-28 09:01:52'),(59,1,'product/desc/XoU3z3-WE','product/thumb/jOxJ8lbV1H',NULL,'updated description','updated name',100000,133,0,5,100000,NULL,1,'2021-04-27 13:52:53','2021-04-27 20:11:26'),(61,1,'product/desc/5IlH2TQTG','product/thumb/2zur8NU0dK',NULL,'this is a description','name',30000,123,0,0,5000,NULL,0,'2021-04-28 09:18:09','2021-04-28 09:18:09');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(200) NOT NULL,
  `image_order` int NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (3,1,'product/productImages/04Nw4kwNZ',1,'2021-04-18 04:16:11','2021-04-18 04:16:11'),(4,1,'product/productImages/6sewGxPDeX',2,'2021-04-18 04:16:11','2021-04-18 04:16:11'),(5,1,'product/productImages/lawMdpfjl-',3,'2021-04-18 04:16:11','2021-04-18 04:16:11'),(8,4,'product/productImages/-pBiEHvO9P',2,'2021-04-18 13:03:49','2021-04-18 13:03:49'),(9,4,'product/productImages/oCwEsVhmFE',1,'2021-04-18 13:03:49','2021-04-18 13:03:49'),(10,5,'product/productImages/qJq6rntN-5',2,'2021-04-18 13:06:08','2021-04-18 13:06:08'),(11,5,'product/productImages/E0U-XtoiLz',1,'2021-04-18 13:06:08','2021-04-18 13:06:08'),(12,6,'product/productImages/8GXXPa0oKz',2,'2021-04-18 13:06:40','2021-04-18 13:06:40'),(13,6,'product/productImages/_Qinh4mloL',1,'2021-04-18 13:06:40','2021-04-18 13:06:40'),(14,1,'product/productImages/XH_u9UmNC',1,'2021-04-18 13:19:21','2021-04-18 13:19:21'),(15,1,'product/productImages/JmkKxfvsKp',3,'2021-04-18 13:19:21','2021-04-18 13:19:21'),(16,1,'product/productImages/I-948vpZw-',2,'2021-04-18 13:19:21','2021-04-18 13:19:21'),(23,51,'product/productImages/SVtdNCoS52',1,'2021-04-18 14:32:40','2021-04-18 14:32:40'),(24,52,'product/productImages/ep4Fh7aUmn',1,'2021-04-18 14:34:12','2021-04-18 14:34:12'),(25,52,'product/productImages/D7W9HVsXsS',2,'2021-04-18 14:34:12','2021-04-18 14:34:12'),(26,1,'product/productImages/sY620i0DK',1,'2021-04-18 14:42:19','2021-04-18 14:42:19'),(27,1,'product/productImages/WUKLfuMBMw',2,'2021-04-18 14:42:19','2021-04-18 14:42:19'),(28,1,'product/productImages/OT4TNDLJia',3,'2021-04-18 14:42:19','2021-04-18 14:42:19'),(29,54,'product/productImages/Kdj4A5AIuC',1,'2021-04-27 13:18:18','2021-04-27 13:18:18'),(30,54,'product/productImages/J_4OcoaARs',2,'2021-04-27 13:18:18','2021-04-27 13:18:18'),(31,55,'product/productImages/w1cRfZCjUK',1,'2021-04-27 13:20:54','2021-04-27 13:20:54'),(32,55,'product/productImages/QHPVvTGmkn',2,'2021-04-27 13:20:54','2021-04-27 13:20:54'),(33,56,'product/productImages/rjfWf1H7wc',1,'2021-04-27 13:40:03','2021-04-27 13:40:03'),(34,56,'product/productImages/rNFnZYk6Dd',2,'2021-04-27 13:40:03','2021-04-27 13:40:03'),(35,57,'product/productImages/1gebV9WeGr',1,'2021-04-27 13:48:34','2021-04-27 13:48:34'),(36,57,'product/productImages/-W_tPEdPjs',2,'2021-04-27 13:48:34','2021-04-27 13:48:34'),(37,58,'product/productImages/cg2idYtPy6',1,'2021-04-27 13:52:22','2021-04-27 13:52:22'),(38,58,'product/productImages/xAFOwPUcQc',2,'2021-04-27 13:52:22','2021-04-27 13:52:22'),(39,59,'product/productImages/tnLBWFhE_u',1,'2021-04-27 13:52:53','2021-04-27 13:52:53'),(40,59,'product/productImages/QjHfz_Ha8i',2,'2021-04-27 13:52:53','2021-04-27 13:52:53'),(43,61,'product/productImages/qj6Oye4qQ-',1,'2021-04-28 09:18:09','2021-04-28 09:18:09'),(44,61,'product/productImages/qxfBjdmGXk',2,'2021-04-28 09:18:09','2021-04-28 09:18:09'),(47,1,'product/productImages/wbZ7kmzIZ',1,'2021-04-28 10:01:03','2021-04-28 10:01:03'),(48,1,'product/productImages/8MHZ8x8viZ',2,'2021-04-28 10:01:03','2021-04-28 10:01:03'),(49,1,'product/productImages/35OmQM01PN',3,'2021-04-28 10:01:03','2021-04-28 10:01:03'),(50,60,'product/productImages/K0k17oh-i',1,'2021-04-28 10:01:25','2021-04-28 10:01:25'),(51,60,'product/productImages/uZztiHjVlr',2,'2021-04-28 10:01:25','2021-04-28 10:01:25'),(52,60,'product/productImages/cYEHwP0c62',3,'2021-04-28 10:01:25','2021-04-28 10:01:25'),(53,12345,'product/productImages/em0vE527i',1,'2021-04-28 10:01:30','2021-04-28 10:01:30'),(54,12345,'product/productImages/dHnNNcL-zf',2,'2021-04-28 10:01:30','2021-04-28 10:01:30'),(55,12345,'product/productImages/pmlYIsdmvD',3,'2021-04-28 10:01:30','2021-04-28 10:01:30');
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refund`
--

DROP TABLE IF EXISTS `refund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refund` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT '진행전',
  `refund_type` varchar(45) NOT NULL,
  `reason` varchar(45) NOT NULL,
  `content` varchar(500) NOT NULL,
  `price` int NOT NULL,
  `image_url` varchar(45) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund`
--

LOCK TABLES `refund` WRITE;
/*!40000 ALTER TABLE `refund` DISABLE KEYS */;
/*!40000 ALTER TABLE `refund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `star` tinyint NOT NULL,
  `content` varchar(500) NOT NULL,
  `image_url` varchar(45) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale`
--

DROP TABLE IF EXISTS `sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `product_id` int NOT NULL,
  `price` int NOT NULL,
  `fee` int NOT NULL,
  `date` datetime NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale`
--

LOCK TABLES `sale` WRITE;
/*!40000 ALTER TABLE `sale` DISABLE KEYS */;
INSERT INTO `sale` VALUES (1,1,1,10000,1000,'2021-04-30 00:00:00','2021-04-30 11:58:31','2021-04-30 11:58:31'),(2,1,2,12000,1200,'2021-04-28 00:00:00','2021-04-30 12:01:53','2021-04-30 12:01:53');
/*!40000 ALTER TABLE `sale` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-02 20:23:49
