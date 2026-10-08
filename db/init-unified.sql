-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: auth_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `auth_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `auth_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `auth_db`;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `ward` varchar(100) NOT NULL,
  `address_detail` text NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_default` (`user_id`,`is_default`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyalty_points_history`
--

DROP TABLE IF EXISTS `loyalty_points_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalty_points_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `points` int NOT NULL,
  `type` enum('EARNED','USED','EXPIRED') NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `loyalty_points_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalty_points_history`
--

LOCK TABLES `loyalty_points_history` WRITE;
/*!40000 ALTER TABLE `loyalty_points_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `loyalty_points_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_codes`
--

DROP TABLE IF EXISTS `otp_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_codes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `type` enum('COD','EMAIL_VERIFY','PASSWORD_RESET') DEFAULT 'COD',
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_type` (`user_id`,`type`,`email`),
  KEY `idx_email` (`email`),
  KEY `idx_expires` (`expires_at`),
  KEY `idx_user_email` (`user_id`,`email`),
  CONSTRAINT `otp_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_codes`
--

LOCK TABLES `otp_codes` WRITE;
/*!40000 ALTER TABLE `otp_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `purpose` enum('signup','reset_password','verify_email') DEFAULT 'signup',
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email_purpose` (`email`,`purpose`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_token` (`token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terms_policies`
--

DROP TABLE IF EXISTS `terms_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terms_policies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` enum('terms','privacy','other') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `version` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms_policies`
--

LOCK TABLES `terms_policies` WRITE;
/*!40000 ALTER TABLE `terms_policies` DISABLE KEYS */;
INSERT INTO `terms_policies` VALUES (1,'terms','Äiá»u khoáº£n sá»­ dá»¥ng','ChÃ o má»«ng báº¡n Ä‘áº¿n vá»›i GearUp! Vui lÃ²ng Ä‘á»c ká»¹ cÃ¡c Ä‘iá»u khoáº£n vÃ  Ä‘iá»u kiá»‡n sá»­ dá»¥ng dá»‹ch vá»¥ cá»§a chÃºng tÃ´i.','1.0',1,'2026-10-07 05:43:51'),(2,'privacy','ChÃ­nh sÃ¡ch báº£o máº­t','ChÃºng tÃ´i cam káº¿t báº£o vá»‡ thÃ´ng tin cÃ¡ nhÃ¢n cá»§a báº¡n theo quy Ä‘á»‹nh phÃ¡p luáº­t Viá»‡t Nam.','1.0',1,'2026-10-07 05:43:51');
/*!40000 ALTER TABLE `terms_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `address_detail` text,
  `role` enum('USER','ADMIN') DEFAULT 'USER',
  `is_verified` tinyint(1) DEFAULT '0',
  `oauth_provider` varchar(50) DEFAULT NULL,
  `oauth_id` varchar(255) DEFAULT NULL,
  `loyalty_points` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_oauth` (`oauth_provider`,`oauth_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'tenho051512@gmail.com','$2a$10$rFM0h0Hw2rcy8Htsg/jNeefLsgCffCGietAgmZlbx.K7Q4wTuM6za','System Administrator',NULL,NULL,NULL,NULL,'ADMIN',1,NULL,NULL,0,'2026-10-07 05:43:51','2026-10-07 05:43:51');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `catalog_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `catalog_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `catalog_db`;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_active_order` (`active`,`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Laptop Gaming Đỉnh Cao','RTX 4000 Series - Chiến mọi game AAA 144fps','https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=1920&h=600&fit=crop&q=80','/products?categoryId=1',1,1,'2026-10-07 05:46:07','2026-10-07 05:46:07'),(2,'CPU AMD Ryzen 7000','Zen 4 - Hiệu năng vượt trội - Giá tốt nhất','https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1920&h=600&fit=crop&q=80','/products?categoryId=5',1,2,'2026-10-07 05:46:07','2026-10-07 05:46:07'),(3,'GPU RTX 4070 Ti','DLSS 3 - Gaming 4K mượt mà','https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1920&h=600&fit=crop&q=80','/products?categoryId=6',1,3,'2026-10-07 05:46:07','2026-10-07 05:46:07'),(4,'RAM DDR5 Giá Sốc','Kingston, Corsair - Giảm đến 20%','https://images.unsplash.com/photo-1562976540-1502c2145186?w=1920&h=600&fit=crop&q=80','/products?categoryId=7',1,4,'2026-10-07 05:46:07','2026-10-07 05:46:07'),(5,'Monitor Gaming 240Hz','QHD - G-Sync - Màu chuẩn','https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1920&h=600&fit=crop&q=80','/products?categoryId=13',1,5,'2026-10-07 05:46:07','2026-10-07 05:46:07'),(6,'Gear Gaming Giá Rẻ','Keyboard, Mouse, Headset - Từ 690K','https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1920&h=600&fit=crop&q=80','/products?minPrice=0&maxPrice=2000000',1,6,'2026-10-07 05:46:07','2026-10-07 05:46:07');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_display_order` (`display_order`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Apple',NULL,'CÃ´ng nghá»‡ cao cáº¥p tá»« Má»¹',1,'2026-10-07 05:43:52'),(2,'Dell',NULL,'Laptop & PC tin cáº­y',2,'2026-10-07 05:43:52'),(3,'Asus',NULL,'Gaming vÃ  Ä‘á»“ há»a chuyÃªn nghiá»‡p',3,'2026-10-07 05:43:52'),(4,'Lenovo',NULL,'ThÆ°Æ¡ng hiá»‡u toÃ n cáº§u',4,'2026-10-07 05:43:52'),(5,'HP',NULL,'Giáº£i phÃ¡p vÄƒn phÃ²ng',5,'2026-10-07 05:43:52'),(6,'MSI',NULL,'ChuyÃªn gaming cao cáº¥p',6,'2026-10-07 05:43:52'),(7,'Acer',NULL,'Äa dáº¡ng sáº£n pháº©m',7,'2026-10-07 05:43:52'),(8,'Intel',NULL,NULL,8,'2026-10-07 05:45:58'),(9,'AMD',NULL,NULL,9,'2026-10-07 05:45:58'),(10,'NVIDIA',NULL,NULL,10,'2026-10-07 05:45:58'),(11,'Corsair',NULL,NULL,11,'2026-10-07 05:45:58'),(12,'Kingston',NULL,NULL,12,'2026-10-07 05:45:58'),(13,'G.Skill',NULL,NULL,13,'2026-10-07 05:45:58'),(14,'Team',NULL,NULL,14,'2026-10-07 05:45:58'),(15,'Samsung',NULL,NULL,15,'2026-10-07 05:45:58'),(16,'WD',NULL,NULL,16,'2026-10-07 05:45:58'),(17,'Seagate',NULL,NULL,17,'2026-10-07 05:45:58'),(18,'Crucial',NULL,NULL,18,'2026-10-07 05:45:58'),(19,'Gigabyte',NULL,NULL,19,'2026-10-07 05:45:58'),(20,'ASRock',NULL,NULL,20,'2026-10-07 05:45:58'),(21,'Logitech',NULL,NULL,21,'2026-10-07 05:45:58'),(22,'Razer',NULL,NULL,22,'2026-10-07 05:45:58'),(23,'SteelSeries',NULL,NULL,23,'2026-10-07 05:45:58'),(24,'HyperX',NULL,NULL,24,'2026-10-07 05:45:58'),(25,'NZXT',NULL,NULL,25,'2026-10-07 05:45:58'),(26,'Cooler Master',NULL,NULL,26,'2026-10-07 05:45:58'),(27,'be quiet!',NULL,NULL,27,'2026-10-07 05:45:58'),(28,'LG',NULL,NULL,28,'2026-10-07 05:45:58'),(29,'AOC',NULL,NULL,29,'2026-10-07 05:45:58'),(30,'BenQ',NULL,NULL,30,'2026-10-07 05:45:58');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_display_order` (`display_order`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Laptop Gaming',NULL,'Laptop hiá»‡u nÄƒng cao cho game thá»§',1,'2026-10-07 05:43:52'),(9,'Laptop Văn phòng',NULL,NULL,2,'2026-10-07 05:45:58'),(10,'Laptop Đồ họa',NULL,NULL,3,'2026-10-07 05:45:58'),(11,'Laptop Sinh viên',NULL,NULL,4,'2026-10-07 05:45:58'),(12,'CPU - Bộ vi xử lý',NULL,NULL,5,'2026-10-07 05:45:58'),(13,'GPU - Card đồ họa',NULL,NULL,6,'2026-10-07 05:45:58'),(14,'RAM - Bộ nhớ',NULL,NULL,7,'2026-10-07 05:45:58'),(15,'SSD - Ổ cứng',NULL,NULL,8,'2026-10-07 05:45:58'),(16,'Mainboard - Bo mạch chủ',NULL,NULL,9,'2026-10-07 05:45:58'),(17,'Case - Vỏ máy tính',NULL,NULL,10,'2026-10-07 05:45:58'),(18,'PSU - Nguồn máy tính',NULL,NULL,11,'2026-10-07 05:45:58'),(19,'Cooling - Tản nhiệt',NULL,NULL,12,'2026-10-07 05:45:58'),(20,'Monitor - Màn hình',NULL,NULL,13,'2026-10-07 05:45:58'),(21,'Keyboard - Bàn phím',NULL,NULL,14,'2026-10-07 05:45:58'),(22,'Mouse - Chuột',NULL,NULL,15,'2026-10-07 05:45:58'),(23,'Headset - Tai nghe',NULL,NULL,16,'2026-10-07 05:45:58');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_cart_items`
--

DROP TABLE IF EXISTS `guest_cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guest_cart_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price_cents` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guest_cart_id` (`guest_cart_id`,`product_id`),
  KEY `idx_guest_cart_id` (`guest_cart_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `guest_cart_items_ibfk_1` FOREIGN KEY (`guest_cart_id`) REFERENCES `guest_carts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_cart_items`
--

LOCK TABLES `guest_cart_items` WRITE;
/*!40000 ALTER TABLE `guest_cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `guest_cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_carts`
--

DROP TABLE IF EXISTS `guest_carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_carts` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_carts`
--

LOCK TABLES `guest_carts` WRITE;
/*!40000 ALTER TABLE `guest_carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `guest_carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_comments`
--

DROP TABLE IF EXISTS `guest_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `guest_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `guest_comments_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_comments`
--

LOCK TABLES `guest_comments` WRITE;
/*!40000 ALTER TABLE `guest_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `guest_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `product_id` bigint NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`),
  KEY `idx_stock` (`stock`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (9,5),(7,6),(4,8),(8,8),(3,10),(22,10),(38,10),(2,12),(6,12),(1,15),(17,15),(35,15),(5,20),(21,20),(41,20),(46,20),(16,25),(20,25),(26,25),(34,25),(44,25),(50,25),(14,30),(36,30),(45,30),(51,30),(56,30),(10,35),(11,35),(19,35),(33,35),(53,35),(57,35),(12,40),(15,40),(18,40),(25,40),(32,40),(37,40),(40,40),(43,40),(47,40),(49,40),(13,50),(24,50),(29,50),(39,50),(48,50),(55,50),(23,60),(31,60),(52,60),(28,70),(27,80),(42,80),(54,80),(30,90);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `url` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_sort` (`product_id`,`sort_order`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80',0),(2,1,'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',1),(3,1,'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',2),(4,2,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',0),(5,2,'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80',1),(6,2,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',2),(7,3,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',0),(8,3,'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80',1),(9,3,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',2),(10,4,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',0),(11,4,'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=800&q=80',1),(12,4,'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',2),(13,5,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',0),(14,5,'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',1),(15,5,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',2),(16,6,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',0),(17,6,'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80',1),(18,6,'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',2),(19,7,'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=800&q=80',0),(20,7,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',1),(21,7,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',2),(22,8,'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',0),(23,8,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',1),(24,8,'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=800&q=80',2),(25,9,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',0),(26,9,'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80',1),(27,9,'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',2),(28,10,'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80',0),(29,10,'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',1),(30,10,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',2),(31,11,'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',0),(32,11,'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80',1),(33,11,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',2),(34,12,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',0),(35,12,'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80',1),(36,12,'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',2),(37,13,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',0),(38,13,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(39,13,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(40,14,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',0),(41,14,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',1),(42,14,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(43,15,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',0),(44,15,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(45,15,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',2),(46,16,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',0),(47,16,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',1),(48,16,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',2),(49,17,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',0),(50,17,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(51,17,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(52,18,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',0),(53,18,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(54,18,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(55,19,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',0),(56,19,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',1),(57,19,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(58,20,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',0),(59,20,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(60,20,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(61,21,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',0),(62,21,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',1),(63,21,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(64,22,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',0),(65,22,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(66,22,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(67,23,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',0),(68,23,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(69,23,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(70,24,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',0),(71,24,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',1),(72,24,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(73,25,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',0),(74,25,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',1),(75,25,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(76,26,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',0),(77,26,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(78,26,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',2),(79,27,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',0),(80,27,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',1),(81,27,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(82,28,'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',0),(83,28,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',1),(84,28,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(85,29,'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',0),(86,29,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',1),(87,29,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(88,30,'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',0),(89,30,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',1),(90,30,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',2),(91,31,'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',0),(92,31,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(93,31,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(94,32,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',0),(95,32,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(96,32,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(97,33,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',0),(98,33,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',1),(99,33,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(100,34,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',0),(101,34,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(102,34,'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',2),(103,35,'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80',0),(104,35,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',1),(105,35,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',2),(106,36,'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',0),(107,36,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',1),(108,36,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(109,37,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',0),(110,37,'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',1),(111,37,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(112,38,'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',0),(113,38,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(114,38,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(115,39,'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',0),(116,39,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(117,39,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(118,40,'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',0),(119,40,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',1),(120,40,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(121,41,'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',0),(122,41,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',1),(123,41,'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',2),(124,42,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',0),(125,42,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',1),(126,42,'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',2),(127,43,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',0),(128,43,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(129,43,'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',2),(130,44,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',0),(131,44,'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',1),(132,44,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(133,45,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',0),(134,45,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80',1),(135,45,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(136,46,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80',0),(137,46,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',1),(138,46,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(139,47,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',0),(140,47,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80',1),(141,47,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(142,48,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',0),(143,48,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(144,48,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80',2),(145,49,'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',0),(146,49,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',1),(147,49,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(148,50,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',0),(149,50,'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',1),(150,50,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(151,51,'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',0),(152,51,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',1),(153,51,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',2),(154,52,'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',0),(155,52,'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',1),(156,52,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(157,53,'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',0),(158,53,'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',1),(159,53,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(160,54,'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',0),(161,54,'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',1),(162,54,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(163,55,'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80',0),(164,55,'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80',1),(165,55,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2),(166,56,'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80',0),(167,56,'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80',1),(168,56,'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',2),(169,57,'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80',0),(170,57,'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80',1),(171,57,'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',2);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `admin_reply` text COLLATE utf8mb4_unicode_ci,
  `replied_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_rating` (`rating`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_cents` int NOT NULL,
  `discount_percent` int DEFAULT '0',
  `image_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_sku` (`sku`),
  KEY `idx_display_order` (`product_id`,`display_order`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'16GB RAM / 512GB SSD','VAR1-1791351960903',32990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:00'),(2,1,'32GB RAM / 1TB SSD','VAR1-1791351961077',37990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:01'),(3,2,'16GB RAM / 512GB SSD','VAR2-1791351961364',28990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:01'),(4,2,'32GB RAM / 1TB SSD','VAR2-1791351961531',33990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:01'),(5,3,'16GB RAM / 512GB SSD','VAR3-1791351961821',35990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:01'),(6,3,'32GB RAM / 1TB SSD','VAR3-1791351962001',40990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:02'),(7,4,'16GB RAM / 512GB SSD','VAR4-1791351962290',45990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:02'),(8,4,'32GB RAM / 1TB SSD','VAR4-1791351962469',50990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:02'),(9,5,'16GB RAM / 512GB SSD','VAR5-1791351962758',28990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:02'),(10,5,'32GB RAM / 1TB SSD','VAR5-1791351962941',33990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:02'),(11,6,'16GB RAM / 512GB SSD','VAR6-1791351963228',42990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:03'),(12,6,'32GB RAM / 1TB SSD','VAR6-1791351963409',47990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:03'),(13,7,'16GB RAM / 512GB SSD','VAR7-1791351963695',52990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:03'),(14,7,'32GB RAM / 1TB SSD','VAR7-1791351963878',57990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:03'),(15,8,'16GB RAM / 512GB SSD','VAR8-1791351964164',59990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:04'),(16,8,'32GB RAM / 1TB SSD','VAR8-1791351964346',64990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:04'),(17,9,'16GB RAM / 512GB SSD','VAR9-1791351964649',64990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:04'),(18,9,'32GB RAM / 1TB SSD','VAR9-1791351964831',69990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:04'),(19,10,'16GB RAM / 512GB SSD','VAR10-1791351965119',12990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:05'),(20,10,'32GB RAM / 1TB SSD','VAR10-1791351965299',17990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:05'),(21,11,'16GB RAM / 512GB SSD','VAR11-1791351965589',12990000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:05'),(22,11,'32GB RAM / 1TB SSD','VAR11-1791351965783',17990000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:05'),(23,12,'16GB RAM / 512GB SSD','VAR12-1791351966068',13490000,0,NULL,'{\"ram\": \"16GB\", \"storage\": \"512GB SSD\"}',1,'2026-10-07 05:46:06'),(24,12,'32GB RAM / 1TB SSD','VAR12-1791351966247',18490000,5,NULL,'{\"ram\": \"32GB\", \"storage\": \"1TB SSD\"}',2,'2026-10-07 05:46:06'),(25,13,'Box (Có quạt tản nhiệt)','VAR13-1791351966536',4490000,0,NULL,'{\"type\": \"Box\", \"cooler\": \"Included\"}',1,'2026-10-07 05:46:06'),(26,13,'Tray (Không có quạt)','VAR13-1791351966702',3990000,0,NULL,'{\"type\": \"Tray\", \"cooler\": \"Not Included\"}',2,'2026-10-07 05:46:06'),(27,14,'Box (Có quạt tản nhiệt)','VAR14-1791351966989',9990000,0,NULL,'{\"type\": \"Box\", \"cooler\": \"Included\"}',1,'2026-10-07 05:46:06'),(28,14,'Tray (Không có quạt)','VAR14-1791351967167',9490000,0,NULL,'{\"type\": \"Tray\", \"cooler\": \"Not Included\"}',2,'2026-10-07 05:46:07'),(29,15,'Box (Có quạt tản nhiệt)','VAR15-1791351967454',5990000,0,NULL,'{\"type\": \"Box\", \"cooler\": \"Included\"}',1,'2026-10-07 05:46:07'),(30,15,'Tray (Không có quạt)','VAR15-1791351967619',5490000,0,NULL,'{\"type\": \"Tray\", \"cooler\": \"Not Included\"}',2,'2026-10-07 05:46:07');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand_id` bigint DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price_cents` int NOT NULL,
  `discount_percent` int DEFAULT '0',
  `specs` json DEFAULT NULL,
  `features` json DEFAULT NULL,
  `image_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_brand` (`brand_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_price` (`price_cents`),
  KEY `idx_name` (`name`),
  FULLTEXT KEY `idx_search` (`name`,`description`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'MSI-KATANA15','MSI Katana 15 B13VFK',6,1,'RTX 4060, i7-13620H, 144Hz gaming',32990000,15,'{\"design\": {\"os\": \"Windows 11 Home\", \"weight\": \"2.25kg\"}, \"battery\": {\"life\": \"Up to 5 hours\", \"capacity\": \"53.5Whr\"}, \"display\": {\"size\": \"15.6 inch\", \"panel_type\": \"IPS-Level\", \"resolution\": \"1920x1080 (FHD)\", \"refresh_rate\": \"144Hz\"}, \"performance\": {\"cpu\": \"Intel Core i7-13620H (10 cores, 16 threads, up to 4.9GHz)\", \"gpu\": \"NVIDIA GeForce RTX 4060 8GB GDDR6\", \"ram\": \"16GB DDR5-4800MHz (2x8GB, upgradable to 64GB)\", \"storage\": \"512GB NVMe PCIe Gen4 SSD\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E\", \"ports\": \"Thunderbolt 4, USB-C, HDMI 2.1\", \"bluetooth\": \"Bluetooth 5.3\"}}','[\"NVIDIA DLSS 3 & Ray Tracing\", \"Cooler Boost 5 dual fan cooling\", \"Nahimic Audio Enhancer\", \"RGB Gaming Keyboard by SteelSeries\", \"Wi-Fi 6E & Bluetooth 5.3\", \"Thunderbolt 4 support\", \"HD webcam with privacy shutter\"]','https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80','2026-10-07 05:45:58'),(2,'ASUS-ROG-G15','Asus ROG Strix G15',3,1,'RTX 3060, Ryzen 7 6800H, 300Hz',28990000,10,'{\"design\": {\"os\": \"Windows 11 Home\", \"weight\": \"2.3kg\"}, \"battery\": {\"life\": \"Up to 8 hours\", \"capacity\": \"90Whr\"}, \"display\": {\"size\": \"15.6 inch\", \"brightness\": \"300 nits\", \"panel_type\": \"IPS 3ms\", \"resolution\": \"1920x1080 (FHD)\", \"refresh_rate\": \"300Hz\"}, \"performance\": {\"cpu\": \"AMD Ryzen 7 6800H (8 cores, 16 threads, up to 4.7GHz)\", \"gpu\": \"NVIDIA GeForce RTX 3060 6GB GDDR6\", \"ram\": \"16GB DDR5-4800MHz (upgradable to 32GB)\", \"storage\": \"512GB NVMe PCIe Gen4 SSD\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6\", \"ports\": \"2x USB Type-C (DisplayPort, Power Delivery), USB-A 3.2\", \"bluetooth\": \"Bluetooth 5.2\"}}','[\"AMD FreeSync Premium\", \"ROG Intelligent Cooling with liquid metal\", \"Aura Sync RGB lighting\", \"MUX Switch with Advanced Optimus\", \"Dolby Atmos speakers\", \"Per-key RGB keyboard\", \"2x USB Type-C with DisplayPort & Power Delivery\"]','https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80','2026-10-07 05:45:58'),(3,'LENOVO-LEGION5','Lenovo Legion 5 Pro',4,1,'RTX 4060, i7-13700HX, WQXGA 165Hz',35990000,0,'{\"audio\": {\"speakers\": \"2x 2W Harman speakers\", \"technology\": \"Nahimic Audio\"}, \"design\": {\"os\": \"Windows 11 Home\", \"weight\": \"2.5kg\"}, \"battery\": {\"life\": \"Up to 7 hours\", \"capacity\": \"80Whr\"}, \"display\": {\"size\": \"16 inch\", \"brightness\": \"500 nits\", \"panel_type\": \"IPS G-Sync\", \"resolution\": \"2560x1600 (WQXGA)\", \"refresh_rate\": \"165Hz\"}, \"performance\": {\"cpu\": \"Intel Core i7-13700HX (16 cores, 24 threads, up to 5.0GHz)\", \"gpu\": \"NVIDIA GeForce RTX 4060 8GB GDDR6\", \"ram\": \"16GB DDR5-5600MHz (2x8GB, upgradable to 32GB)\", \"storage\": \"512GB NVMe PCIe Gen4 SSD (2x M.2 slots)\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E\", \"ports\": \"USB-C (Power Delivery), USB-A 3.2, HDMI 2.1\", \"bluetooth\": \"Bluetooth 5.2\"}}','[\"NVIDIA DLSS 3 & Reflex\", \"Legion Coldfront 5.0 vapor chamber\", \"Tobii Horizon eye tracking\", \"4-zone RGB keyboard with 1.5mm travel\", \"Nahimic Audio with 2W Harman speakers\", \"Legion TrueStrike keyboard\", \"iCUE compatible RGB\"]','https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80','2026-10-07 05:45:58'),(4,'DELL-XPS13PLUS','Dell XPS 13 Plus',2,9,'i7-1360P, OLED 3.5K, siêu mỏng',45990000,0,'{\"design\": {\"os\": \"Windows 11 Home\", \"weight\": \"1.24kg\", \"thickness\": \"15.28mm\"}, \"battery\": {\"life\": \"Up to 12 hours\", \"capacity\": \"55Whr\"}, \"display\": {\"size\": \"13.4 inch\", \"brightness\": \"400 nits\", \"panel_type\": \"OLED InfinityEdge\", \"resolution\": \"3456x2160 (3.5K)\"}, \"performance\": {\"cpu\": \"Intel Core i7-1360P (12 cores, up to 5.0GHz)\", \"gpu\": \"Intel Iris Xe Graphics\", \"ram\": \"16GB LPDDR5-5200MHz (onboard)\", \"storage\": \"512GB NVMe PCIe Gen4 SSD\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E\", \"ports\": \"Thunderbolt 4 (2 ports)\", \"bluetooth\": \"Bluetooth 5.2\"}}','[\"OLED touchscreen với 100% DCI-P3\", \"Thiết kế không viền siêu mỏng\", \"Haptic touchpad với phản hồi xúc giác\", \"Capacitive touch function keys\", \"Thunderbolt 4 (2 ports)\", \"Fingerprint reader trên nút nguồn\", \"Killer Wi-Fi 6E AX1690\", \"ExpressCharge sạc nhanh 80% trong 1 giờ\"]','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80','2026-10-07 05:45:58'),(5,'APPLE-MACAIR-M3','MacBook Air M3 2024',1,9,'M3 chip, 18h pin, Retina 13.6\"',28990000,0,'{\"design\": {\"os\": \"macOS Sonoma\", \"weight\": \"1.24kg\", \"thickness\": \"11.3mm\"}, \"battery\": {\"life\": \"Up to 18 hours video playback\"}, \"display\": {\"size\": \"13.6 inch\", \"brightness\": \"500 nits\", \"resolution\": \"2560x1664 (Liquid Retina)\", \"color_gamut\": \"P3 wide color\"}, \"performance\": {\"cpu\": \"Apple M3 chip (8-core CPU with 4 performance and 4 efficiency cores)\", \"gpu\": \"8-core GPU với Hardware Ray Tracing\", \"ram\": \"8GB Unified Memory (lên đến 24GB)\", \"storage\": \"256GB SSD (lên đến 2TB)\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E (802.11ax)\", \"ports\": \"MagSafe 3 + 2x Thunderbolt\", \"bluetooth\": \"Bluetooth 5.3\"}}','[\"Chip M3 với 3nm process\", \"Hỗ trợ 2 màn hình ngoài (với màn hình laptop đóng)\", \"Magic Keyboard với Touch ID\", \"1080p FaceTime HD camera\", \"4-speaker system với Spatial Audio\", \"Sạc MagSafe 3 + 2x Thunderbolt\", \"Wi-Fi 6E (802.11ax)\", \"Fanless design hoàn toàn im lặng\"]','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80','2026-10-07 05:45:58'),(6,'LENOVO-X1-CARBON','Lenovo ThinkPad X1 Carbon Gen 11',4,9,'i7-1355U, OLED 2.8K, MIL-STD-810H',42990000,0,'{\"design\": {\"os\": \"Windows 11 Pro\", \"weight\": \"1.12kg\", \"durability\": \"MIL-STD-810H\"}, \"battery\": {\"life\": \"Up to 15 hours\", \"capacity\": \"57Whr\"}, \"display\": {\"size\": \"14 inch\", \"brightness\": \"400 nits\", \"panel_type\": \"OLED\", \"resolution\": \"2880x1800 (2.8K)\", \"color_gamut\": \"100% DCI-P3\"}, \"performance\": {\"cpu\": \"Intel Core i7-1355U (10 cores, up to 5.0GHz vPro)\", \"gpu\": \"Intel Iris Xe Graphics\", \"ram\": \"16GB LPDDR5-6400MHz (onboard)\", \"storage\": \"512GB NVMe PCIe Gen4 SSD\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E\", \"ports\": \"2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.1\", \"bluetooth\": \"Bluetooth 5.2\"}}','[\"MIL-STD-810H military durability\", \"Dolby Atmos Speaker System\", \"FHD IR + RGB Hybrid camera với Privacy Shutter\", \"Backlit ThinkPad keyboard với TrackPoint\", \"Match-on-Chip fingerprint reader\", \"Wi-Fi 6E & 5G option\", \"Rapid Charge 80% trong 1 giờ\", \"Carbon fiber + magnesium chassis\"]','https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80','2026-10-07 05:45:58'),(7,'DELL-XPS15-9530','Dell XPS 15 9530',2,10,'i7-13700H, RTX 4050, OLED 3.5K',52990000,0,'{\"design\": {\"os\": \"Windows 11 Pro\", \"weight\": \"1.86kg\"}, \"battery\": {\"life\": \"Up to 13 hours\", \"capacity\": \"86Whr\"}, \"display\": {\"size\": \"15.6 inch\", \"brightness\": \"400 nits\", \"panel_type\": \"OLED InfinityEdge\", \"resolution\": \"3456x2160 (3.5K)\", \"color_gamut\": \"100% DCI-P3\"}, \"performance\": {\"cpu\": \"Intel Core i7-13700H (14 cores, 20 threads, up to 5.0GHz)\", \"gpu\": \"NVIDIA GeForce RTX 4050 6GB GDDR6\", \"ram\": \"32GB DDR5-4800MHz (2x16GB, upgradable to 64GB)\", \"storage\": \"1TB NVMe PCIe Gen4 SSD\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E\", \"ports\": \"2x Thunderbolt 4, USB-C 3.2, SD card reader\", \"bluetooth\": \"Bluetooth 5.2\"}}','[\"OLED touchscreen với Dolby Vision\", \"100% DCI-P3 color gamut - chuẩn màu chuyên nghiệp\", \"NVIDIA Studio drivers tối ưu cho creative apps\", \"Precision touchpad kích thước lớn\", \"Quad speakers (8W) with Waves MaxxAudio Pro\", \"Vapor chamber cooling system\", \"ExpressCharge 3.0 - sạc 80% trong 1 giờ\", \"Corning Gorilla Glass 7 touchscreen\"]','https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=800&q=80','2026-10-07 05:45:58'),(8,'APPLE-MACPRO14-M3PRO','MacBook Pro 14 M3 Pro',1,10,'M3 Pro, XDR 14.2\", 17h pin',59990000,0,'{\"design\": {\"os\": \"macOS Sonoma\", \"weight\": \"1.55kg\"}, \"battery\": {\"life\": \"Up to 18 hours video, 12 hours wireless web\"}, \"display\": {\"size\": \"14.2 inch\", \"brightness\": \"1000 nits sustained, 1600 nits peak HDR\", \"resolution\": \"3024x1964 (Liquid Retina XDR)\", \"refresh_rate\": \"Up to 120Hz (ProMotion)\"}, \"performance\": {\"cpu\": \"Apple M3 Pro chip (11-core CPU, 5P+6E)\", \"gpu\": \"14-core GPU với Hardware Ray Tracing & Mesh Shading\", \"ram\": \"18GB Unified Memory (lên đến 36GB)\", \"storage\": \"512GB SSD (lên đến 4TB)\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E\", \"ports\": \"3x Thunderbolt 4, HDMI 2.1, SDXC card, MagSafe 3\", \"bluetooth\": \"Bluetooth 5.3\"}}','[\"Liquid Retina XDR display 1000nits sustained, 1600nits peak\", \"ProMotion technology up to 120Hz\", \"Hỗ trợ 2 external displays 6K@60Hz\", \"1080p FaceTime HD camera với advanced ISP\", \"Studio-quality 6-speaker với Spatial Audio\", \"Studio-quality 3-mic array với voice isolation\", \"Magic Keyboard với Touch ID\", \"Active cooling cho sustained performance\"]','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80','2026-10-07 05:45:58'),(9,'MSI-CREATOR-Z16','MSI Creator Z16 HX Studio',6,10,'i9-13950HX, RTX 4070, Mini-LED QHD+',64990000,0,'{\"design\": {\"os\": \"Windows 11 Pro for Workstations\", \"weight\": \"2.39kg\"}, \"battery\": {\"life\": \"Up to 9 hours\", \"capacity\": \"90Whr\"}, \"display\": {\"size\": \"16 inch\", \"brightness\": \"1000 nits\", \"panel_type\": \"Mini-LED 1000+ dimming zones\", \"resolution\": \"2560x1600 (QHD+)\", \"color_gamut\": \"100% DCI-P3\", \"refresh_rate\": \"165Hz\"}, \"performance\": {\"cpu\": \"Intel Core i9-13950HX (24 cores, 32 threads, up to 5.5GHz)\", \"gpu\": \"NVIDIA GeForce RTX 4070 8GB GDDR6 Studio\", \"ram\": \"64GB DDR5-5600MHz (2x32GB)\", \"storage\": \"2TB NVMe PCIe Gen4 SSD (2x 1TB RAID 0)\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6E\", \"ports\": \"Thunderbolt 4, 3x USB-A 3.2, HDMI 2.1, SD Express 7.0\", \"bluetooth\": \"Bluetooth 5.2\"}}','[\"Mini-LED với 1000+ dimming zones, 1000nits\", \"NVIDIA Studio drivers - certified cho Adobe, Autodesk\", \"Cooler Boost Trinity+ với 3 fans + 7 heat pipes\", \"Per-key RGB keyboard with white backlight mode\", \"Golden ratio 16:10 touchscreen\", \"MSI Center Pro for creators\", \"Hi-Res Audio với 4 speakers (6W)\", \"True Pixel Display 100% DCI-P3 color accurate\"]','https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80','2026-10-07 05:45:58'),(10,'ACER-ASPIRE5','Acer Aspire 5 A515',7,11,'i5-1335U, 512GB SSD, Full HD',12990000,12,'{\"design\": {\"os\": \"Windows 11 Home + Office 2021\", \"weight\": \"1.7kg\"}, \"battery\": {\"life\": \"Up to 8 hours\", \"capacity\": \"50Whr\"}, \"display\": {\"size\": \"15.6 inch\", \"panel_type\": \"IPS slim bezel\", \"resolution\": \"1920x1080 (Full HD)\"}, \"performance\": {\"cpu\": \"Intel Core i5-1335U (10 cores, up to 4.6GHz)\", \"gpu\": \"Intel Iris Xe Graphics\", \"ram\": \"8GB DDR4-3200MHz (1 slot free, upgradable to 32GB)\", \"storage\": \"512GB NVMe PCIe SSD\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 6\", \"ports\": \"USB-C, 2x USB 3.2, USB 2.0, HDMI, LAN RJ-45\", \"bluetooth\": \"Bluetooth 5.1\"}}','[\"Giá thành tốt cho sinh viên\", \"Full HD IPS với góc nhìn rộng\", \"Bàn phím số tiện lợi cho Excel\", \"Tặng kèm Office 2021 bản quyền\", \"Webcam HD với physical privacy shutter\", \"Dual speakers với Acer TrueHarmony\", \"Wi-Fi 6 AX201\", \"Có thể nâng cấp RAM và SSD dễ dàng\"]','https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80','2026-10-07 05:45:58'),(11,'HP-15S-FQ5231TU','HP 15s-fq5231TU',5,11,'i3-1215U, Office 2021, giá rẻ',12990000,0,'{\"design\": {\"os\": \"Windows 11 Home + Office Home & Student 2021\", \"weight\": \"1.69kg\"}, \"battery\": {\"life\": \"Up to 7 hours\", \"capacity\": \"41Whr\"}, \"display\": {\"size\": \"15.6 inch\", \"panel_type\": \"SVA anti-glare\", \"resolution\": \"1366x768 (HD)\"}, \"performance\": {\"cpu\": \"Intel Core i3-1215U (6 cores, up to 4.4GHz)\", \"gpu\": \"Intel UHD Graphics\", \"ram\": \"8GB DDR4-3200MHz (onboard)\", \"storage\": \"256GB NVMe PCIe SSD\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 5 (802.11ac)\", \"ports\": \"USB-C, 2x USB-A 3.2, HDMI 1.4, SD card reader\", \"bluetooth\": \"Bluetooth 5.0\"}}','[\"Giá cực kỳ phải chăng\", \"Tặng Office 2021 bản quyền\", \"HP Fast Charge - sạc 50% trong 45 phút\", \"Dual speakers với Audio by B&O\", \"Webcam HP TrueVision 720p\", \"Thiết kế nhẹ, dễ mang theo\", \"Wi-Fi 5 (802.11ac)\", \"Bảo hành 12 tháng chính hãng HP\"]','https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80','2026-10-07 05:45:59'),(12,'ASUS-VIVOBOOK15','Asus VivoBook 15 X1504ZA',3,11,'i5-1235U, NanoEdge display',13490000,0,'{\"design\": {\"os\": \"Windows 11 Home\", \"weight\": \"1.7kg\"}, \"battery\": {\"life\": \"Up to 6 hours\", \"capacity\": \"42Whr\"}, \"display\": {\"size\": \"15.6 inch\", \"brightness\": \"250 nits\", \"panel_type\": \"NanoEdge IPS\", \"resolution\": \"1920x1080 (Full HD)\"}, \"performance\": {\"cpu\": \"Intel Core i5-1235U (10 cores, up to 4.4GHz)\", \"gpu\": \"Intel Iris Xe Graphics\", \"ram\": \"8GB DDR4-3200MHz (1 slot free, upgradable to 16GB)\", \"storage\": \"512GB NVMe PCIe SSD (M.2 slot free)\"}, \"connectivity\": {\"wifi\": \"Wi-Fi 5\", \"ports\": \"USB-C 3.2, 2x USB-A 3.2, USB 2.0, HDMI, microSD\", \"bluetooth\": \"Bluetooth 5.0\"}}','[\"NanoEdge display với viền mỏng 82% screen-to-body\", \"Full HD IPS với độ chính xác màu tốt\", \"Ergonomic backlit keyboard\", \"Có thể nâng cấp RAM và thêm SSD thứ 2\", \"ASUS SonicMaster stereo speakers\", \"Webcam với privacy shutter\", \"Wi-Fi 5 & Bluetooth 5.0\", \"Thiết kế trẻ trung với nhiều màu sắc\"]','https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80','2026-10-07 05:45:59'),(13,'INTEL-I5-13400F','Intel Core i5-13400F',8,12,'10 nhân 16 luồng, turbo 4.6GHz, LGA1700',4490000,10,'{\"tdp\": \"65W base, 148W max\", \"cache\": \"20MB Intel Smart Cache\", \"cores\": \"10 cores / 16 threads (6P+4E)\", \"memory\": \"DDR5-4800, DDR4-3200\", \"socket\": \"LGA1700\", \"process\": \"Intel 7 (10nm)\", \"base_clock\": \"2.5GHz\", \"turbo_clock\": \"4.6GHz\"}','[\"Hiệu suất vượt trội cho gaming và đa nhiệm\", \"Hỗ trợ cả DDR4 và DDR5\", \"Intel Thread Director thông minh\", \"PCIe 5.0 và PCIe 4.0 support\", \"Tương thích mainboard B660, H610, B760\", \"Không có iGPU - cần card rời\", \"Tản nhiệt stock cooler hoạt động tốt\"]','https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80','2026-10-07 05:45:59'),(14,'INTEL-I7-13700K','Intel Core i7-13700K',8,12,'16 nhân 24 luồng, turbo 5.4GHz, unlocked',9990000,8,'{\"tdp\": \"125W base, 253W max\", \"cache\": \"30MB Intel Smart Cache\", \"cores\": \"16 cores / 24 threads (8P+8E)\", \"memory\": \"DDR5-5600, DDR4-3200\", \"socket\": \"LGA1700\", \"process\": \"Intel 7 (10nm)\", \"unlocked\": \"Yes - Overclockable\", \"base_clock\": \"3.4GHz\", \"turbo_clock\": \"5.4GHz\"}','[\"Unlocked for overclocking\", \"Hiệu suất cao cho gaming và content creation\", \"Intel UHD Graphics 770 integrated\", \"Intel Turbo Boost Max 3.0\", \"PCIe 5.0 x16 + PCIe 4.0\", \"Intel Thermal Velocity Boost\", \"Yêu cầu tản nhiệt khí tốt (240mm AIO khuyến nghị)\", \"Tương thích Z690, Z790 cho OC\"]','https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80','2026-10-07 05:45:59'),(15,'AMD-RYZEN5-7600X','AMD Ryzen 5 7600X',9,12,'6 nhân 12 luồng, Zen 4, AM5',5990000,12,'{\"tdp\": \"105W\", \"cache\": \"32MB L3 + 6MB L2\", \"cores\": \"6 cores / 12 threads\", \"memory\": \"DDR5-5200\", \"socket\": \"AM5\", \"process\": \"5nm Zen 4\", \"unlocked\": \"Yes - Overclockable\", \"base_clock\": \"4.7GHz\", \"turbo_clock\": \"5.3GHz\"}','[\"Kiến trúc Zen 4 mới nhất\", \"Hiệu suất gaming vượt trội\", \"Chỉ hỗ trợ DDR5\", \"AMD EXPO profiles cho RAM OC\", \"PCIe 5.0 support\", \"Radeon Graphics integrated (2 cores)\", \"AMD Precision Boost Overdrive 2\", \"Socket AM5 mới - hỗ trợ lâu dài\"]','https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80','2026-10-07 05:45:59'),(16,'AMD-RYZEN7-7800X3D','AMD Ryzen 7 7800X3D',9,12,'8 nhân 16 luồng, 3D V-Cache, gaming tốt nhất',10990000,0,'{\"tdp\": \"120W\", \"cache\": \"96MB 3D V-Cache (64MB stacked + 32MB L3)\", \"cores\": \"8 cores / 16 threads\", \"memory\": \"DDR5-5200\", \"socket\": \"AM5\", \"process\": \"5nm Zen 4 + 3D V-Cache\", \"unlocked\": \"Limited OC\", \"base_clock\": \"4.2GHz\", \"turbo_clock\": \"5.0GHz\"}','[\"CPU gaming tốt nhất hiện nay\", \"3D V-Cache technology độc quyền\", \"Hiệu suất cao với TDP thấp\", \"Tản nhiệt dễ dàng hơn 7950X3D\", \"Không cần OC đã mạnh\", \"Tối ưu cho 1440p và 4K gaming\", \"Socket AM5 - upgrade lâu dài\", \"96MB cache giảm lag trong game\"]','https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80','2026-10-07 05:45:59'),(17,'INTEL-I9-13900K','Intel Core i9-13900K',8,12,'24 nhân 32 luồng, turbo 5.8GHz, flagship',14990000,0,'{\"tdp\": \"125W base, 253W max\", \"cache\": \"36MB Intel Smart Cache\", \"cores\": \"24 cores / 32 threads (8P+16E)\", \"memory\": \"DDR5-5600, DDR4-3200\", \"socket\": \"LGA1700\", \"process\": \"Intel 7 (10nm)\", \"unlocked\": \"Yes - Overclockable\", \"base_clock\": \"3.0GHz\", \"turbo_clock\": \"5.8GHz\"}','[\"CPU flagship mạnh nhất của Intel\", \"Unlocked for extreme overclocking\", \"Hiệu suất đa nhân vượt trội\", \"Intel UHD Graphics 770\", \"Turbo Boost Max 3.0 đến 5.8GHz\", \"Yêu cầu tản nhiệt 360mm AIO\", \"Tối ưu cho workstation và gaming\", \"Hỗ trợ PCIe 5.0 và DDR5-5600\"]','https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80','2026-10-07 05:45:59'),(18,'NVIDIA-RTX4060-8GB','NVIDIA GeForce RTX 4060 8GB',10,13,'Ada Lovelace, DLSS 3, gaming Full HD/1440p',8490000,10,'{\"vram\": \"8GB GDDR6\", \"power\": \"115W TDP\", \"cuda_cores\": \"3072\", \"boost_clock\": \"2460 MHz\", \"architecture\": \"Ada Lovelace\"}','[]','https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80','2026-10-07 05:45:59'),(19,'AMD-RX7600-8GB','AMD Radeon RX 7600 8GB',9,13,'RDNA 3, FSR 3, gaming 1080p tốt',7490000,12,'{\"vram\": \"8GB GDDR6\", \"power\": \"165W TDP\", \"boost_clock\": \"2655 MHz\", \"architecture\": \"RDNA 3\", \"stream_processors\": \"2048\"}','[]','https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80','2026-10-07 05:45:59'),(20,'NVIDIA-RTX4070-12GB','NVIDIA GeForce RTX 4070 12GB',10,13,'Ada Lovelace, DLSS 3, gaming 1440p/4K',14990000,8,'{\"vram\": \"12GB GDDR6X\", \"power\": \"200W TDP\", \"cuda_cores\": \"5888\", \"boost_clock\": \"2475 MHz\", \"architecture\": \"Ada Lovelace\"}','[]','https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80','2026-10-07 05:45:59'),(21,'AMD-RX7800XT-16GB','AMD Radeon RX 7800 XT 16GB',9,13,'RDNA 3, FSR 3, gaming 1440p xuất sắc',13990000,0,'{\"vram\": \"16GB GDDR6\", \"power\": \"263W TDP\", \"boost_clock\": \"2430 MHz\", \"architecture\": \"RDNA 3\", \"stream_processors\": \"3840\"}','[]','https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80','2026-10-07 05:45:59'),(22,'NVIDIA-RTX4090-24GB','NVIDIA GeForce RTX 4090 24GB',10,13,'Ada Lovelace, DLSS 3, gaming 4K flagship',44990000,0,'{\"vram\": \"24GB GDDR6X\", \"power\": \"450W TDP\", \"cuda_cores\": \"16384\", \"boost_clock\": \"2520 MHz\", \"architecture\": \"Ada Lovelace\"}','[]','https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80','2026-10-07 05:45:59'),(23,'CORSAIR-VENGEANCE-16GB','Corsair Vengeance RGB 16GB DDR5-6000',11,14,'2x8GB, RGB, Intel XMP 3.0',2490000,10,'{\"rgb\": \"Corsair iCUE RGB\", \"type\": \"DDR5\", \"speed\": \"6000MHz\", \"latency\": \"CL36\", \"capacity\": \"16GB (2x8GB)\"}','[\"DDR5 thế hệ mới với băng thông cao\", \"Đèn RGB 10 zone điều khiển qua iCUE\", \"Intel XMP 3.0 - overclock 1 click\", \"Tản nhiệt nhôm nguyên khối\", \"Độ trễ thấp CL36 cho hiệu suất tối ưu\"]','https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80','2026-10-07 05:45:59'),(24,'KINGSTON-FURY-32GB','Kingston FURY Beast 32GB DDR5-5600',12,14,'2x16GB, Intel XMP, AMD EXPO',4290000,8,'{\"rgb\": \"No RGB\", \"type\": \"DDR5\", \"speed\": \"5600MHz\", \"latency\": \"CL40\", \"capacity\": \"32GB (2x16GB)\"}','[\"Dung lượng 32GB cho đa nhiệm nặng\", \"Hỗ trợ cả Intel XMP và AMD EXPO\", \"Thiết kế tản nhiệt đơn giản, hiệu quả\", \"Tương thích rộng rãi mainboard DDR5\", \"Bảo hành trọn đời từ Kingston\"]','https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80','2026-10-07 05:45:59'),(25,'GSKILL-TRIDENT-32GB','G.Skill Trident Z5 RGB 32GB DDR5-6400',13,14,'2x16GB, RGB, overclock cao',5990000,0,'{\"rgb\": \"Trident Z5 RGB\", \"type\": \"DDR5\", \"speed\": \"6400MHz\", \"latency\": \"CL32\", \"capacity\": \"32GB (2x16GB)\"}','[\"Tốc độ DDR5-6400 cực nhanh\", \"Độ trễ CL32 thấp cho overclocker\", \"Đèn RGB đa vùng đồng bộ\", \"IC chất lượng cao được chọn lọc\", \"Thiết kế tản nhiệt kim loại cao cấp\"]','https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80','2026-10-07 05:45:59'),(26,'CORSAIR-DOMINATOR-64GB','Corsair Dominator Platinum RGB 64GB DDR5-5600',11,14,'2x32GB, RGB, cao cấp',9990000,0,'{\"rgb\": \"Dominator RGB\", \"type\": \"DDR5\", \"speed\": \"5600MHz\", \"latency\": \"CL40\", \"capacity\": \"64GB (2x32GB)\"}','[\"Dung lượng khủng 64GB cho workstation\", \"Thiết kế Dominator cao cấp với tản nhiệt Dual-Path DHX\", \"Đèn RGB 12 LED riêng lẻ điều khiển iCUE\", \"IC Samsung B-die chất lượng cao\", \"Bảo hành trọn đời Corsair\"]','https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80','2026-10-07 05:45:59'),(27,'TEAM-TFORCE-16GB','Team T-Force Delta RGB 16GB DDR4-3600',14,14,'2x8GB, RGB, giá rẻ DDR4',1490000,15,'{\"rgb\": \"Delta RGB\", \"type\": \"DDR4\", \"speed\": \"3600MHz\", \"latency\": \"CL18\", \"capacity\": \"16GB (2x8GB)\"}','[\"Giá cực tốt cho DDR4 RGB\", \"Tốc độ 3600MHz phù hợp gaming\", \"Đèn RGB 120° rực rỡ\", \"Tương thích rộng rãi mainboard DDR4\", \"Bảo hành trọn đời\"]','https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80','2026-10-07 05:45:59'),(28,'SAMSUNG-980PRO-1TB','Samsung 980 PRO 1TB NVMe Gen4',15,15,'PCIe 4.0, 7000MB/s read, 5000MB/s write',2990000,10,'{\"capacity\": \"1TB\", \"warranty\": \"5 years\", \"interface\": \"PCIe 4.0 x4 NVMe\", \"read_speed\": \"7000 MB/s\", \"write_speed\": \"5000 MB/s\"}','[\"Tốc độ đọc 7000 MB/s cực nhanh\", \"PCIe 4.0 x4 NVMe thế hệ mới\", \"Công nghệ V-NAND của Samsung\", \"Bảo hành 5 năm chính hãng\", \"Phù hợp gaming và creative work\"]','https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80','2026-10-07 05:45:59'),(29,'WD-BLACK-SN850X-2TB','WD Black SN850X 2TB NVMe Gen4',16,15,'PCIe 4.0, 7300MB/s, gaming',5490000,8,'{\"capacity\": \"2TB\", \"warranty\": \"5 years\", \"interface\": \"PCIe 4.0 x4 NVMe\", \"read_speed\": \"7300 MB/s\", \"write_speed\": \"6600 MB/s\"}','[\"Tốc độ đỉnh cao 7300 MB/s\", \"Dung lượng 2TB rộng rãi\", \"Tối ưu cho gaming nặng\", \"Game Mode 2.0 giảm lag\", \"Bảo hành 5 năm WD\"]','https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80','2026-10-07 05:45:59'),(30,'CRUCIAL-P3PLUS-1TB','Crucial P3 Plus 1TB NVMe Gen4',18,15,'PCIe 4.0, giá rẻ, 5000MB/s',1890000,12,'{\"capacity\": \"1TB\", \"warranty\": \"5 years\", \"interface\": \"PCIe 4.0 x4 NVMe\", \"read_speed\": \"5000 MB/s\", \"write_speed\": \"4200 MB/s\"}','[\"Giá tốt nhất phân khúc Gen4\", \"Tốc độ 5000 MB/s ổn định\", \"Tiết kiệm điện năng hiệu quả\", \"Độ bền cao từ Micron\", \"Bảo hành 5 năm Crucial\"]','https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80','2026-10-07 05:45:59'),(31,'SAMSUNG-870EVO-1TB','Samsung 870 EVO 1TB SATA SSD',15,15,'SATA 2.5\", 560MB/s, tin cậy',2290000,0,'{\"capacity\": \"1TB\", \"warranty\": \"5 years\", \"interface\": \"SATA III 2.5\\\"\", \"read_speed\": \"560 MB/s\", \"write_speed\": \"530 MB/s\"}','[\"SATA SSD tin cậy nhất\", \"Tương thích mọi laptop, PC cũ\", \"Tốc độ SATA tối đa 560 MB/s\", \"Công nghệ V-NAND bền bỉ\", \"Bảo hành 5 năm Samsung\"]','https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80','2026-10-07 05:45:59'),(32,'ASUS-B760-PLUS','Asus Prime B760-Plus D4',3,16,'LGA1700, DDR4, PCIe 5.0',3490000,10,'{\"socket\": \"LGA1700\", \"chipset\": \"Intel B760\", \"pcie_slots\": \"1x PCIe 5.0 x16, 2x PCIe 3.0 x1\", \"form_factor\": \"ATX\", \"memory_support\": \"DDR4 up to 5333MHz\"}','[\"Hỗ trợ CPU Intel thế hệ 12, 13, 14\", \"PCIe 5.0 sẵn sàng cho tương lai\", \"DDR4 tiết kiệm chi phí\", \"AI Noise Cancellation tích hợp\", \"Bảo hành 3 năm Asus\"]','https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80','2026-10-07 05:45:59'),(33,'MSI-B650-GAMING','MSI MAG B650 Tomahawk WiFi',6,16,'AM5, DDR5, WiFi 6E',4990000,8,'{\"socket\": \"AM5\", \"chipset\": \"AMD B650\", \"pcie_slots\": \"1x PCIe 4.0 x16, 2x PCIe 4.0 x1\", \"form_factor\": \"ATX\", \"memory_support\": \"DDR5 up to 6400MHz\"}','[\"Hỗ trợ Ryzen 7000 series\", \"WiFi 6E tích hợp sẵn\", \"DDR5 tốc độ cao\", \"Tản nhiệt VRM mạnh mẽ\", \"Audio Boost 5 chất lượng cao\"]','https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80','2026-10-07 05:45:59'),(34,'GIGABYTE-Z790-AORUS','Gigabyte Z790 Aorus Elite AX',19,16,'LGA1700, DDR5, WiFi 6E, overclock',6490000,0,'{\"socket\": \"LGA1700\", \"chipset\": \"Intel Z790\", \"pcie_slots\": \"1x PCIe 5.0 x16, 2x PCIe 4.0 x16\", \"form_factor\": \"ATX\", \"memory_support\": \"DDR5 up to 7600MHz\"}','[\"Chipset Z790 cao cấp cho overclock\", \"DDR5 tốc độ đến 7600MHz\", \"WiFi 6E và 2.5GbE LAN\", \"RGB Fusion 2.0\", \"VRM 16+1+2 phases mạnh mẽ\"]','https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80','2026-10-07 05:45:59'),(35,'ASROCK-X670E-TAICHI','ASRock X670E Taichi',20,16,'AM5, DDR5, PCIe 5.0, flagship',12990000,0,'{\"socket\": \"AM5\", \"chipset\": \"AMD X670E\", \"pcie_slots\": \"2x PCIe 5.0 x16\", \"form_factor\": \"ATX\", \"memory_support\": \"DDR5 up to 6600MHz\"}','[\"Flagship X670E cho Ryzen 7000\", \"2 slot PCIe 5.0 x16 độc quyền\", \"VRM 24 phases cực mạnh\", \"Polychrome RGB đồng bộ\", \"Thiết kế Taichi sang trọng\"]','https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80','2026-10-07 05:45:59'),(36,'NZXT-H510-ELITE','NZXT H510 Elite',25,17,'Mid Tower, tempered glass, RGB fans',3490000,10,'{\"material\": \"Steel + Tempered Glass\", \"form_factor\": \"Mid Tower\", \"fans_included\": \"2x 140mm RGB front, 1x 120mm rear\", \"max_cpu_cooler\": \"165mm\", \"max_gpu_length\": \"381mm\"}','[\"Kính cường lực 2 bên đẹp mắt\", \"2 quạt RGB 140mm tích hợp\", \"Khái cable management gọn gàng\", \"Hỗ trợ GPU dài đến 381mm\", \"Điều khiển RGB qua CAM software\"]','https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80','2026-10-07 05:46:00'),(37,'CORSAIR-4000D-AIRFLOW','Corsair 4000D Airflow',11,17,'Mid Tower, airflow tốt, giá tốt',2490000,12,'{\"material\": \"Steel + Tempered Glass\", \"form_factor\": \"Mid Tower\", \"fans_included\": \"2x 120mm front\", \"max_cpu_cooler\": \"170mm\", \"max_gpu_length\": \"360mm\"}','[\"Airflow vượt trội cho tản nhiệt\", \"Giá cực tốt phân khúc\", \"Kính cường lực 1 bên\", \"Dễ lắp ráp và nâng cấp\", \"Chất lượng Corsair\"]','https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80','2026-10-07 05:46:00'),(38,'CM-HAF700-EVO','Cooler Master HAF 700 EVO',26,17,'Full Tower, RGB, cao cấp',14990000,0,'{\"material\": \"Steel + Tempered Glass\", \"form_factor\": \"Full Tower\", \"fans_included\": \"3x 200mm ARGB, 1x 140mm ARGB\", \"max_cpu_cooler\": \"190mm\", \"max_gpu_length\": \"490mm\"}','[\"Full Tower siêu khủng cho build cao cấp\", \"4 quạt ARGB 200mm/140mm\", \"Hỗ trợ GPU đến 490mm\", \"Tản nhiệt đỉnh cao cho workstation\", \"Thiết kế HAF huyền thoại\"]','https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80','2026-10-07 05:46:00'),(39,'CORSAIR-RM750E','Corsair RM750e 750W 80+ Gold',11,18,'Modular, 80+ Gold, 10 năm BH',2490000,10,'{\"modular\": \"Fully Modular\", \"wattage\": \"750W\", \"warranty\": \"10 years\", \"efficiency\": \"80+ Gold\", \"pcie_connectors\": \"4x PCIe 8-pin\"}','[\"Hiệu suất 80+ Gold tiết kiệm điện\", \"Fully Modular gọn gàng dây\", \"Bảo hành 10 năm Corsair\", \"Quạt 135mm yên tĩnh\", \"Phù hợp build gaming thông thường\"]','https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80','2026-10-07 05:46:00'),(40,'BEQUIET-PURE-850W','be quiet! Pure Power 12 M 850W',27,18,'Modular, 80+ Gold, yên tĩnh',3290000,8,'{\"modular\": \"Fully Modular\", \"wattage\": \"850W\", \"warranty\": \"10 years\", \"efficiency\": \"80+ Gold\", \"pcie_connectors\": \"4x PCIe 8-pin\"}','[\"Thương hiệu yên tĩnh số 1 thế giới\", \"850W cho build cao cấp\", \"Quạt 120mm siêu yên tĩnh\", \"Hiệu suất 80+ Gold\", \"Bảo hành 10 năm\"]','https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80','2026-10-07 05:46:00'),(41,'CORSAIR-HX1000I','Corsair HX1000i 1000W 80+ Platinum',11,18,'Digital monitoring, Platinum, cao cấp',5990000,0,'{\"modular\": \"Fully Modular\", \"wattage\": \"1000W\", \"warranty\": \"10 years\", \"efficiency\": \"80+ Platinum\", \"pcie_connectors\": \"6x PCIe 8-pin\"}','[\"1000W cho build workstation\", \"Hiệu suất 80+ Platinum\", \"Giám sát digital qua Corsair Link\", \"6 dây PCIe cho GPU đa\", \"Bảo hành 10 năm\"]','https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80','2026-10-07 05:46:00'),(42,'CM-HYPER212','Cooler Master Hyper 212 RGB Black',26,19,'Air cooler, RGB, giá rẻ',790000,15,'{\"type\": \"Air Cooler\", \"height\": \"158mm\", \"fan_size\": \"120mm RGB\", \"tdp_rating\": \"150W\", \"socket_support\": \"Intel LGA1700/1200, AMD AM5/AM4\"}','[\"Giá rẻ nhất cho build cơ bản\", \"Quạt RGB đẹp mắt\", \"Dễ lắp đặt cho người mới\", \"Tản được CPU phổ thông\", \"Thương hiệu nổi tiếng\"]','https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80','2026-10-07 05:46:00'),(43,'NZXT-KRAKEN-X63','NZXT Kraken X63 RGB 280mm AIO',25,19,'280mm AIO, RGB, LCD display',4290000,10,'{\"type\": \"AIO Liquid Cooler\", \"fan_size\": \"2x 140mm RGB\", \"tdp_rating\": \"250W\", \"radiator_size\": \"280mm\", \"socket_support\": \"Intel LGA1700/1200, AMD AM5/AM4\"}','[\"AIO 280mm hiệu năng cao\", \"Màn hình LCD hiển thị GIF\", \"Điều khiển qua NZXT CAM\", \"RGB đồng bộ toàn hệ thống\", \"Thiết kế đẹp mắt\"]','https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80','2026-10-07 05:46:00'),(44,'CORSAIR-H150I-ELITE','Corsair iCUE H150i Elite LCD 360mm',11,19,'360mm AIO, LCD screen, cao cấp',7990000,0,'{\"type\": \"AIO Liquid Cooler\", \"fan_size\": \"3x 120mm RGB\", \"tdp_rating\": \"300W\", \"radiator_size\": \"360mm\", \"socket_support\": \"Intel LGA1700/1200, AMD AM5/AM4\"}','[\"AIO 360mm cao cấp nhất\", \"Màn hình LCD 2.1 inch hiển thị\", \"Tản nhiệt cho CPU overclock\", \"Điều khiển RGB qua iCUE\", \"Bảo hành 5 năm\"]','https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80','2026-10-07 05:46:00'),(45,'LG-27GL850','LG UltraGear 27GL850 27\" 144Hz',28,20,'QHD 1440p, Nano IPS, 1ms, G-Sync',7490000,10,'{\"size\": \"27 inch\", \"sync\": \"G-Sync Compatible\", \"panel\": \"Nano IPS\", \"resolution\": \"2560x1440 (QHD)\", \"refresh_rate\": \"144Hz\", \"response_time\": \"1ms GtG\"}','[\"Nano IPS màu sắc chuẩn 98% DCI-P3\", \"144Hz mượt mà cho gaming\", \"G-Sync chống giật\", \"Thiết kế gọn gàng đẹp\", \"Phù hợp cả gaming và làm việc\"]','https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80','2026-10-07 05:46:00'),(46,'SAMSUNG-G7-32','Samsung Odyssey G7 32\" 240Hz Curved',15,20,'QHD, VA 1000R curve, HDR600',12990000,8,'{\"size\": \"32 inch\", \"sync\": \"G-Sync + FreeSync Premium Pro\", \"panel\": \"VA Curved 1000R\", \"resolution\": \"2560x1440 (QHD)\", \"refresh_rate\": \"240Hz\", \"response_time\": \"1ms\"}','[\"Màn 32 inch 240Hz cho gaming chuyên sâu\", \"Màn cong 1000R몰입감 cao\", \"HDR 600 màu sắc sống động\", \"G-Sync và FreeSync đầy đủ\", \"Độ phân giải 1440p tối ưu\"]','https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80','2026-10-07 05:46:00'),(47,'DELL-S2722DGM','Dell S2722DGM 27\" 165Hz Curved',2,20,'QHD, VA curve, giá tốt',5990000,12,'{\"size\": \"27 inch\", \"sync\": \"FreeSync Premium\", \"panel\": \"VA Curved 1500R\", \"resolution\": \"2560x1440 (QHD)\", \"refresh_rate\": \"165Hz\", \"response_time\": \"1ms MPRT\"}','[\"Giá tốt nhất cho màn cong 1440p\", \"Màn cong몰입감 tốt\", \"165Hz mượt mà đủ dùng\", \"Chất lượng Dell uy tín\", \"FreeSync cho AMD GPU\"]','https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80','2026-10-07 05:46:00'),(48,'AOC-24G2','AOC 24G2 24\" 144Hz IPS',29,20,'Full HD, IPS, giá sinh viên',3990000,15,'{\"size\": \"24 inch\", \"sync\": \"FreeSync Premium\", \"panel\": \"IPS\", \"resolution\": \"1920x1080 (Full HD)\", \"refresh_rate\": \"144Hz\", \"response_time\": \"1ms MPRT\"}','[\"Giá rẻ nhất cho màn 144Hz IPS\", \"IPS màu sắc sống động\", \"Kích thước 24 inch vừa đủ\", \"Phù hợp sinh viên, gaming nhẹ\", \"FreeSync cho mượt mà\"]','https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80','2026-10-07 05:46:00'),(49,'LOGITECH-G512','Logitech G512 Carbon RGB',21,21,'Mechanical, GX Brown, RGB',2290000,10,'{\"rgb\": \"Per-key RGB Lightsync\", \"type\": \"Mechanical Gaming\", \"switch\": \"GX Brown Tactile\", \"features\": \"Aircraft-grade aluminum\", \"connectivity\": \"USB Wired\"}','[\"Switch GX Brown êm và tiếng nhỏ\", \"RGB Lightsync đồng bộ toàn hệ thống\", \"Khung nhôm aircraft-grade bền bỉ\", \"Phù hợp cả gaming và làm việc\", \"Chất lượng Logitech\"]','https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80','2026-10-07 05:46:00'),(50,'RAZER-BLACKWIDOW-V3','Razer BlackWidow V3 Pro',22,21,'Wireless, Green switch, RGB',4790000,8,'{\"rgb\": \"Razer Chroma RGB\", \"type\": \"Mechanical Gaming\", \"switch\": \"Razer Green Clicky\", \"battery\": \"200 hours\", \"features\": \"Doubleshot ABS keycaps\", \"connectivity\": \"Wireless 2.4GHz + Bluetooth + USB-C Wired\", \"actuation_force\": \"50g\", \"actuation_point\": \"1.9mm\"}','[\"Kết nối 3 chế độ: 2.4GHz/Bluetooth/Có dây\", \"Switch Razer Green clicky tactile đặc trưng\", \"Chroma RGB 16.8 triệu màu per-key\", \"Pin siêu trâu 200 giờ liên tục\", \"Keycap Doubleshot ABS không phai màu\", \"Full-size 104 phím đầy đủ chức năng\"]','https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80','2026-10-07 05:46:00'),(51,'STEELSERIES-APEX-PRO','SteelSeries Apex Pro TKL',23,21,'OmniPoint switch, tenkeyless',3990000,0,'{\"rgb\": \"Per-key RGB\", \"type\": \"Mechanical Gaming\", \"switch\": \"OmniPoint Adjustable\", \"features\": \"Magnetic switches, OLED display\", \"actuation\": \"0.4mm - 3.6mm adjustable\", \"connectivity\": \"USB Wired\"}','[\"Switch OmniPoint từ tính điều chỉnh được\", \"Tùy chỉnh độ nhạy từ 0.4mm đến 3.6mm\", \"Màn hình OLED hiển thị thông tin\", \"TKL compact tiết kiệm không gian\", \"Khung nhôm cao cấp siêu bền\", \"RGB per-key Prism Sync đồng bộ\"]','https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80','2026-10-07 05:46:00'),(52,'LOGITECH-G502-HERO','Logitech G502 HERO',21,22,'25K DPI, 11 buttons, RGB',1290000,15,'{\"dpi\": \"100 - 25600 DPI\", \"rgb\": \"Lightsync RGB\", \"sensor\": \"HERO 25K\", \"weight\": \"121g (adjustable)\", \"buttons\": \"11 programmable\", \"max_speed\": \"400 IPS\", \"connectivity\": \"USB Wired\", \"polling_rate\": \"1000Hz\", \"max_acceleration\": \"40G\"}','[\"Sensor HERO 25K siêu chính xác 1:1 tracking\", \"11 nút lập trình tùy biến hoàn toàn\", \"Hệ thống tăng giảm DPI nhanh on-the-fly\", \"Trọng lượng điều chỉnh được bằng quả cân\", \"RGB Lightsync đồng bộ với thiết bị Logitech\", \"Giá tốt nhất cho gaming mouse cao cấp\"]','https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80','2026-10-07 05:46:00'),(53,'RAZER-DEATHADDER-V3','Razer DeathAdder V3 Pro',22,22,'Wireless, 30K DPI, 90h battery',3490000,10,'{\"dpi\": \"100 - 30000 DPI\", \"rgb\": \"Razer Chroma RGB (logo only)\", \"sensor\": \"Focus Pro 30K Optical\", \"weight\": \"63g\", \"battery\": \"90 hours\", \"buttons\": \"8 programmable\", \"max_speed\": \"750 IPS\", \"connectivity\": \"HyperSpeed Wireless 2.4GHz + USB-C Wired\", \"polling_rate\": \"1000Hz / 4000Hz HyperPolling\", \"resolution_accuracy\": \"99.8%\"}','[\"Sensor Focus Pro 30K mới nhất thế hệ Gen-3\", \"Siêu nhẹ chỉ 63g cho esports\", \"Pin 90 giờ liên tục cực trâu\", \"HyperSpeed Wireless nhanh như có dây\", \"Thiết kế ergonomic thoải mái cho tay phải\", \"DeathAdder V3 - huyền thoại tiếp nối\"]','https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80','2026-10-07 05:46:00'),(54,'STEELSERIES-RIVAL3','SteelSeries Rival 3',23,22,'TrueMove Core, giá rẻ',690000,20,'{\"dpi\": \"200 - 8500 CPI\", \"rgb\": \"Prism RGB 3-zone\", \"sensor\": \"TrueMove Core\", \"weight\": \"77g\", \"buttons\": \"6 programmable\", \"max_speed\": \"300 IPS\", \"durability\": \"60 million clicks\", \"connectivity\": \"USB Wired\", \"polling_rate\": \"1000Hz\"}','[\"Giá rẻ nhất trong phân khúc gaming mouse\", \"Sensor TrueMove Core 1:1 tracking chính xác\", \"RGB Prism 3 vùng sáng đẹp mắt\", \"Nhẹ nhàng 77g thoải mái cả ngày\", \"Switches bền 60 triệu lần nhấn\", \"Phù hợp sinh viên, game thủ mới bắt đầu\"]','https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80','2026-10-07 05:46:00'),(55,'HYPERX-CLOUD2','HyperX Cloud II',24,23,'7.1 surround, memory foam, USB',1790000,12,'{\"type\": \"Gaming Headset\", \"driver\": \"53mm neodymium\", \"weight\": \"320g\", \"surround\": \"Virtual 7.1 Surround Sound\", \"impedance\": \"60 Ohms\", \"microphone\": \"Detachable noise-cancelling\", \"cable_length\": \"1m + 2m extension\", \"connectivity\": \"USB Sound Card + 3.5mm\", \"mic_frequency\": \"50Hz - 18000Hz\", \"frequency_response\": \"15Hz - 25000Hz\"}','[\"Đệm tai memory foam siêu êm đeo cả ngày\", \"Driver 53mm âm thanh Hi-Fi chất lượng cao\", \"Âm thanh vòm 7.1 ảo qua USB soundcard\", \"Micro chống ồn tháo rời TeamSpeak certified\", \"Khung nhôm bền bỉ siêu chắc chắn\", \"Tương thích đa nền tảng PC, PS4/5, Xbox, Switch\"]','https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80','2026-10-07 05:46:00'),(56,'RAZER-BLACKSHARK-V2-PRO','Razer BlackShark V2 Pro',22,23,'Wireless, THX Spatial, 24h battery',3990000,8,'{\"type\": \"Wireless Gaming Headset\", \"driver\": \"Razer TriForce Titanium 50mm\", \"weight\": \"320g\", \"battery\": \"24 hours (70 hours THX off)\", \"earcups\": \"FlowKnit Memory Foam\", \"surround\": \"THX Spatial Audio\", \"impedance\": \"32 Ohms\", \"microphone\": \"HyperClear Supercardioid Detachable\", \"mic_pattern\": \"Unidirectional\", \"connectivity\": \"Razer HyperSpeed Wireless 2.4GHz + USB-C Wired\", \"mic_frequency\": \"100Hz - 10000Hz\", \"frequency_response\": \"12Hz - 28000Hz\"}','[\"Không dây HyperSpeed 2.4GHz độ trễ cực thấp\", \"THX Spatial Audio định vị kẻ địch chính xác\", \"Pin 24 giờ liên tục (70h khi tắt THX)\", \"Driver TriForce Titanium 50mm âm bass sâu\", \"Micro HyperClear Supercardioid chống ồn tốt\", \"Đệm tai FlowKnit Memory Foam thoáng mát\", \"Nhẹ 320g đeo thoải mái cả ngày\"]','https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80','2026-10-07 05:46:00'),(57,'STEELSERIES-ARCTIS-7PLUS','SteelSeries Arctis 7+',23,23,'Wireless, 30h battery, retractable mic',3290000,0,'{\"type\": \"Wireless Gaming Headset\", \"driver\": \"40mm neodymium\", \"weight\": \"350g\", \"battery\": \"30 hours\", \"earcups\": \"AirWeave Memory Foam\", \"surround\": \"DTS Headphone:X v2.0\", \"impedance\": \"32 Ohms\", \"microphone\": \"ClearCast Retractable Bidirectional\", \"fast_charge\": \"15 min = 3 hours\", \"connectivity\": \"SteelSeries Sonar Wireless 2.4GHz + USB-C + 3.5mm\", \"mic_frequency\": \"100Hz - 6500Hz\", \"mic_sensitivity\": \"-38dB\", \"frequency_response\": \"20Hz - 20000Hz\"}','[\"Pin 30 giờ siêu trâu + sạc nhanh 15 phút = 3 giờ\", \"Micro ClearCast rút gọn tiện lợi Discord certified\", \"DTS Headphone:X v2.0 âm thanh vòm 7.1 sống động\", \"Kết nối không dây 2.4GHz ổn định zero lag\", \"Băng đầu treo SKI Goggle siêu thoải mái\", \"Đệm tai AirWeave thoáng mát không nóng\", \"Tương thích PC, PlayStation, Nintendo Switch\"]','https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80','2026-10-07 05:46:00');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_comments`
--

DROP TABLE IF EXISTS `review_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `review_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_review` (`review_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `review_comments_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_comments`
--

LOCK TABLES `review_comments` WRITE;
/*!40000 ALTER TABLE `review_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_inventory`
--

DROP TABLE IF EXISTS `variant_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_inventory` (
  `variant_id` bigint NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`variant_id`),
  KEY `idx_stock` (`stock`),
  CONSTRAINT `variant_inventory_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_inventory`
--

LOCK TABLES `variant_inventory` WRITE;
/*!40000 ALTER TABLE `variant_inventory` DISABLE KEYS */;
INSERT INTO `variant_inventory` VALUES (2,5),(4,5),(6,5),(8,5),(10,5),(12,5),(14,5),(16,5),(18,5),(20,5),(22,5),(24,5),(1,10),(3,10),(5,10),(7,10),(9,10),(11,10),(13,10),(15,10),(17,10),(19,10),(21,10),(23,10),(26,15),(28,15),(30,15),(25,20),(27,20),(29,20);
/*!40000 ALTER TABLE `variant_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `order_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `order_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `order_db`;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('percentage','fixed','freeship') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `max_usage` int DEFAULT NULL,
  `times_used` int DEFAULT '0',
  `max_usage_per_user` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'SUMMR','percentage',10,1,NULL,NULL,'2026-10-07 05:44:10',10,0,NULL),(2,'SALE1','fixed',1000000,1,NULL,NULL,'2026-10-07 05:44:10',5,0,NULL),(3,'SHIP0','freeship',0,1,NULL,NULL,'2026-10-07 05:44:10',10,0,NULL),(4,'NEW15','percentage',15,1,NULL,NULL,'2026-10-07 05:44:10',8,0,NULL),(5,'WELCM','fixed',500000,1,NULL,NULL,'2026-10-07 05:44:10',10,0,NULL),(6,'VIP20','percentage',20,1,NULL,NULL,'2026-10-07 05:44:10',3,0,NULL),(7,'FLASH','fixed',2000000,1,NULL,NULL,'2026-10-07 05:44:10',5,0,NULL);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_cents` int NOT NULL,
  `quantity` int NOT NULL,
  `subtotal_cents` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `old_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `changed_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `total_cents` int NOT NULL,
  `status` enum('PENDING','CONFIRMED','SHIPPING','DELIVERED','CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `payment_method` enum('COD','VNPAY') COLLATE utf8mb4_unicode_ci DEFAULT 'COD',
  `payment_status` enum('PENDING','PAID','FAILED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `shipping_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_province` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_ward` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_fee_cents` int DEFAULT '0',
  `tracking_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `shipping_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points_used` int DEFAULT '0',
  `points_discount_cents` int DEFAULT '0',
  `discount_cents` int DEFAULT '0',
  `billing_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coupon_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment` (`payment_status`),
  KEY `idx_created` (`created_at`),
  KEY `idx_tracking` (`tracking_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `payment_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `payment_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `payment_db`;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `active` tinyint(1) DEFAULT '1',
  `config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'COD','Thanh toÃ¡n khi nháº­n hÃ ng','Thanh toÃ¡n tiá»n máº·t khi nháº­n hÃ ng',1,NULL,'2026-10-07 05:43:53','2026-10-07 05:43:53'),(2,'VNPAY','Thanh toÃ¡n VNPay','Thanh toÃ¡n trá»±c tuyáº¿n qua VNPay',1,NULL,'2026-10-07 05:43:53','2026-10-07 05:43:53');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `amount_cents` int NOT NULL,
  `payment_method` enum('COD','VNPAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_provider` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `bank_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_response` json DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `cart_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cart_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cart_db`;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-08  5:19:11
