-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for runa_traders_db
CREATE DATABASE IF NOT EXISTS `runa_traders_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `runa_traders_db`;

-- Dumping structure for table runa_traders_db.brands
DROP TABLE IF EXISTS `brands`;
CREATE TABLE IF NOT EXISTS `brands` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `brands_user_id_foreign` (`user_id`),
  CONSTRAINT `brands_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.brands: ~15 rows (approximately)
INSERT INTO `brands` (`id`, `name`, `logo`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 'General', NULL, 'active', 1, '2026-08-23 08:32:18', '2026-08-23 08:32:18'),
	(6, 'Marco Polo Ceramics', NULL, 'Active', 1, '2026-08-25 15:44:21', '2026-08-25 15:44:21'),
	(7, 'Fitting Stocks', NULL, 'Active', 1, '2026-08-27 09:13:55', '2026-08-27 09:13:55'),
	(8, 'RFL', NULL, 'Active', 1, '2026-08-30 16:33:09', '2026-08-30 16:33:09'),
	(9, 'Rosa', NULL, 'Active', 1, '2026-08-30 16:57:22', '2026-08-30 16:57:22'),
	(13, 'Akij', NULL, 'Active', 1, '2026-09-01 09:26:59', '2026-09-01 09:26:59'),
	(16, 'BRB', NULL, 'Active', 1, '2026-09-27 09:54:58', '2026-09-27 09:54:58'),
	(17, 'Astra', NULL, 'Active', 1, '2026-09-27 17:29:40', '2026-09-27 17:29:40'),
	(18, 'Primitake', NULL, 'Active', 1, '2026-09-28 14:36:03', '2026-09-28 14:36:03'),
	(19, 'Satter Metriels', NULL, 'Active', 1, '2026-09-28 15:55:05', '2026-09-28 15:55:05'),
	(20, 'Mollika Metriels', NULL, 'Active', 1, '2026-09-28 17:20:58', '2026-09-28 17:20:58'),
	(21, 'Sorif Metals', NULL, 'Active', 1, '2026-09-28 17:59:58', '2026-09-28 17:59:58'),
	(22, 'Gazi', NULL, 'Active', 1, '2026-09-30 17:27:17', '2026-09-30 17:27:17'),
	(23, 'General', NULL, 'active', 7, '2026-10-08 12:54:10', '2026-10-08 12:54:10'),
	(24, 'Fresh Ceramics', NULL, 'active', 1, '2026-10-09 13:51:24', '2026-10-09 13:51:24');

-- Dumping structure for table runa_traders_db.cache
DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.cache: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.cache_locks
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.cache_locks: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categories_user_id_foreign` (`user_id`),
  CONSTRAINT `categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.categories: ~25 rows (approximately)
INSERT INTO `categories` (`id`, `category_name`, `img_url`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 'Sanitary', NULL, 'active', 1, '2026-08-23 08:32:18', '2026-08-23 08:32:18'),
	(5, 'Pan', NULL, 'Active', 1, '2026-08-25 15:47:44', '2026-08-25 15:47:44'),
	(6, 'Basin', NULL, 'Active', 1, '2026-08-25 16:14:52', '2026-08-25 16:14:52'),
	(7, 'Top Basin', NULL, 'Active', 1, '2026-08-25 16:39:56', '2026-08-25 16:39:56'),
	(8, 'Comod', NULL, 'Active', 1, '2026-08-25 16:47:37', '2026-08-25 16:47:37'),
	(9, 'Satter Materils', NULL, 'Active', 1, '2026-08-27 09:14:28', '2026-08-27 09:14:28'),
	(10, 'Mollika Materials', NULL, 'Active', 1, '2026-08-27 09:58:03', '2026-08-27 09:58:03'),
	(11, 'Mirrors', NULL, 'Active', 1, '2026-08-27 10:08:22', '2026-08-27 10:08:22'),
	(12, 'Glass Self', NULL, 'Active', 1, '2026-08-27 10:29:18', '2026-08-27 10:29:18'),
	(13, 'Paper Holder', NULL, 'Active', 1, '2026-08-27 16:33:39', '2026-08-27 16:33:39'),
	(14, 'Shope Case', NULL, 'Active', 1, '2026-08-27 16:37:16', '2026-08-27 16:37:16'),
	(15, 'jalli', NULL, 'Active', 1, '2026-08-27 16:44:00', '2026-08-27 16:44:00'),
	(16, 'Tawal Roed', NULL, 'Active', 1, '2026-08-27 16:46:26', '2026-08-27 16:46:26'),
	(17, 'Push Shower', NULL, 'Active', 1, '2026-08-29 13:57:10', '2026-08-29 13:57:10'),
	(18, 'Cp Bush', NULL, 'Active', 1, '2026-08-29 14:11:31', '2026-08-29 14:11:31'),
	(19, 'Korien Pudding', NULL, 'Active', 1, '2026-08-29 14:13:13', '2026-08-29 14:13:13'),
	(20, 'GI fitting', NULL, 'Active', 1, '2026-08-29 14:26:56', '2026-08-29 14:26:56'),
	(21, 'Sinks', NULL, 'Active', 1, '2026-08-29 15:13:53', '2026-08-29 15:13:53'),
	(22, 'Gass Stove', NULL, 'Active', 1, '2026-08-30 16:21:05', '2026-08-30 16:21:05'),
	(23, 'RFL', NULL, 'Active', 1, '2026-08-30 16:34:00', '2026-08-30 16:34:00'),
	(24, 'Rosa', NULL, 'Active', 1, '2026-08-30 16:57:41', '2026-08-30 16:57:41'),
	(27, 'Pipe', NULL, 'Active', 1, '2026-09-27 09:55:32', '2026-09-27 09:55:32'),
	(28, 'Tranks', NULL, 'Active', 1, '2026-09-30 17:27:31', '2026-09-30 17:27:31'),
	(29, 'General', NULL, 'active', 7, '2026-10-08 12:54:10', '2026-10-08 12:54:10'),
	(30, 'Tiles', NULL, 'active', 1, '2026-10-09 13:09:00', '2026-10-09 13:09:00');

-- Dumping structure for table runa_traders_db.customers
DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_details` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_due_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district_id` bigint unsigned DEFAULT NULL,
  `upazila_id` bigint unsigned DEFAULT NULL,
  `thana_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `location_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customers_district_id_foreign` (`district_id`),
  KEY `customers_upazila_id_foreign` (`upazila_id`),
  KEY `customers_thana_id_foreign` (`thana_id`),
  KEY `customers_user_id_foreign` (`user_id`),
  KEY `customers_location_id_foreign` (`location_id`),
  CONSTRAINT `customers_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `customers_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `customers_thana_id_foreign` FOREIGN KEY (`thana_id`) REFERENCES `thanas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `customers_upazila_id_foreign` FOREIGN KEY (`upazila_id`) REFERENCES `upazilas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.customers: ~54 rows (approximately)
INSERT INTO `customers` (`id`, `customer_id`, `customer_name`, `address_details`, `date`, `mobile`, `email`, `img_url`, `nid`, `previous_due_amount`, `district_id`, `upazila_id`, `thana_id`, `user_id`, `created_at`, `updated_at`, `location_id`) VALUES
	(1, 'CUST-0001', 'Ma Saleha Enterpice', 'Bus Tarminal, Pabna', NULL, '01711387958', NULL, NULL, NULL, '233680', NULL, NULL, NULL, 1, '2026-08-25 10:45:53', '2026-09-27 11:49:51', NULL),
	(2, 'CUST-0002', 'Nur Battery', 'Tarminal,Pabna', NULL, '01713632575', NULL, NULL, NULL, '497465', NULL, NULL, NULL, 1, '2026-08-25 10:47:28', '2026-09-27 11:50:38', NULL),
	(3, 'CUST-0003', 'Bondu Auto', 'Vuyaqpur, Tangail', NULL, '01725-374182', NULL, NULL, NULL, '378000', NULL, NULL, NULL, 1, '2026-08-25 10:48:23', '2026-08-30 18:09:35', NULL),
	(5, 'CUST-0005', 'Riyaz Battery', 'Radhanogor, Pabna', NULL, '01748-910950', NULL, NULL, NULL, '53592', NULL, NULL, NULL, 1, '2026-08-30 18:12:50', '2026-10-04 12:55:12', NULL),
	(6, 'CUST-0006', 'Ranu tradres', 'Pabna', NULL, '01711-933319', NULL, NULL, NULL, '166370', NULL, NULL, NULL, 1, '2026-08-30 18:17:26', '2026-08-30 18:17:26', NULL),
	(7, 'CUST-0007', 'Mizan tradres', 'Pabna', NULL, '01712-858061', NULL, NULL, NULL, '5635', NULL, NULL, NULL, 1, '2026-08-30 18:18:05', '2026-09-27 11:58:31', NULL),
	(8, 'CUST-0008', 'Runa Tradres', NULL, NULL, '01711-968720', NULL, NULL, NULL, '72350', NULL, NULL, NULL, 1, '2026-08-30 18:18:47', '2026-10-04 13:57:01', NULL),
	(9, 'CUST-0009', 'Hamza Tradres', 'Jalalpur, Pabna', NULL, '017', NULL, NULL, NULL, '32430', NULL, NULL, NULL, 1, '2026-08-30 18:19:58', '2026-08-30 18:19:58', NULL),
	(10, 'CUST-0010', 'Mama Vagne Enterprice', 'Talpukur More ,pabna', NULL, '01713-863336', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-08-30 18:21:44', '2026-10-01 11:43:01', NULL),
	(11, 'CUST-0011', 'Monzu Sir', 'Islami College ,Pabna', NULL, '01716-755112', NULL, NULL, NULL, '31000', NULL, NULL, NULL, 1, '2026-08-30 18:25:10', '2026-08-30 18:25:10', NULL),
	(12, 'CUST-0012', 'Rubel', 'Cina Khora Santipur', NULL, '01711-132785', NULL, NULL, NULL, '30461', NULL, NULL, NULL, 1, '2026-08-30 18:26:38', '2026-08-30 18:26:38', NULL),
	(13, 'CUST-0013', 'Shohiddulla Vai', 'Khoyer Suti pabna', NULL, '01740-965923', NULL, NULL, NULL, '16008', NULL, NULL, NULL, 1, '2026-08-30 18:28:52', '2026-08-30 18:28:52', NULL),
	(14, 'CUST-0014', 'Rafiul biswas', 'Arifpur pabna', NULL, '01783-221489', NULL, NULL, NULL, '4540', NULL, NULL, NULL, 1, '2026-08-30 18:29:53', '2026-08-30 18:29:53', NULL),
	(15, 'CUST-0015', 'Sikat Ali', 'Dogachi,Pabna', NULL, '01818-567270', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-08-30 18:31:04', '2026-09-02 15:39:55', NULL),
	(16, 'CUST-0016', 'Zahid', 'Jalalpur,Pabna', NULL, '017', NULL, NULL, NULL, '1800', NULL, NULL, NULL, 1, '2026-08-30 18:31:40', '2026-08-30 18:31:40', NULL),
	(17, 'CUST-0017', 'Mohamad Ali', 'dapuniya,Pabna', NULL, '01717-108074', NULL, NULL, NULL, '1050', NULL, NULL, NULL, 1, '2026-08-30 18:32:39', '2026-08-30 18:32:39', NULL),
	(19, 'CUST-0019', 'Toyob vai', 'Jalalpur,Pabna', NULL, '01810-335990', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-02 15:55:33', '2026-09-02 15:55:33', NULL),
	(20, 'CUST-0020', 'Suraiya Begum', 'Kacaripara, Pabna', NULL, '01765-164992', NULL, NULL, NULL, '13000', NULL, NULL, NULL, 1, '2026-09-05 10:03:04', '2026-09-05 10:03:04', NULL),
	(21, 'CUST-0021', 'Hanif Mostofa', 'Ulatkaduya ,Sujanogor', NULL, '01704491720', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-15 10:12:05', '2026-09-15 10:12:05', NULL),
	(22, 'CUST-0022', 'Mizan Vai', 'West Raghubpur Pabna', NULL, '01728394564', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-15 10:19:50', '2026-09-15 10:19:50', NULL),
	(23, 'CUST-0023', 'Suraiya Begum', 'Kacharipara , Pabna', NULL, '01765164992', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 09:05:21', '2026-09-16 09:05:21', NULL),
	(24, 'CUST-0024', 'Mizan Vai', 'WestRaghobpur, Pabna', NULL, '013783838383', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 09:14:17', '2026-09-16 09:14:17', NULL),
	(25, 'CUST-0025', 'Aslam Vai', 'MOnohorpur ,Pabna', NULL, '01765351026', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 09:21:53', '2026-09-16 09:21:53', NULL),
	(26, 'CUST-0026', 'Rana Biswas', 'Atikula ,Pabna', NULL, '017386969670', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 09:27:30', '2026-09-16 09:27:30', NULL),
	(27, 'CUST-0027', 'Satter Ali', 'Jalalpur, Pabna', NULL, '0187999999', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 10:14:55', '2026-09-16 10:14:55', NULL),
	(28, 'CUST-0028', 'Mayabi', 'Atuya Kolabari, Mathpara', NULL, '0176565890', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 10:17:34', '2026-09-16 10:17:34', NULL),
	(29, 'CUST-0029', 'Arman SR', 'Pabna', NULL, '01335166820', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 10:34:06', '2026-09-16 11:33:55', NULL),
	(30, 'CUST-0030', 'Unkowen Person', 'Jodgori Jalalpur,Pabna', NULL, '0172343542', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 11:37:48', '2026-09-16 11:37:48', NULL),
	(31, 'CUST-0031', 'Abdur Salam', 'Shiga,Pabna', NULL, '01712271205', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 11:42:51', '2026-09-16 11:42:51', NULL),
	(32, 'CUST-0032', 'Abdur Sobur Member', 'Jalalpur', NULL, '01716437921', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 11:46:39', '2026-09-16 11:46:39', NULL),
	(33, 'CUST-0033', 'Polash vai', 'Ghospur,Pabna', NULL, '01608705248', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 11:49:29', '2026-09-16 11:49:29', NULL),
	(34, 'CUST-0034', 'Imtiaz Ahmed', NULL, NULL, '01788428280', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 11:52:50', '2026-09-16 11:52:50', NULL),
	(35, 'CUST-0035', 'Azim vai', 'Koritola Atghoriya Pabna', NULL, '01724163766', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-16 12:03:36', '2026-09-16 13:37:20', NULL),
	(36, 'CUST-0036', 'Md. Rezaul Islam', 'Dipcr Pk Para', NULL, '01717192849', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-22 16:44:55', '2026-09-22 16:44:55', NULL),
	(37, 'CUST-0037', 'Kafi vai', 'Catmohor,Pabna', NULL, '0176535353', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-22 17:42:34', '2026-09-22 17:42:34', NULL),
	(38, 'CUST-0038', 'Rajeul Islam', 'Radhanogor,pabna', NULL, '01764387270', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-22 17:45:54', '2026-09-22 17:45:54', NULL),
	(39, 'CUST-0039', 'Shahin vai', 'Shalgariya,Pabna', NULL, '01720202786', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-22 17:51:16', '2026-09-22 17:51:16', NULL),
	(40, 'CUST-0040', 'Josna Begum', 'Laibary bazar,Pabna', NULL, '01741280897', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-22 17:53:19', '2026-09-22 17:53:19', NULL),
	(41, 'CUST-0041', 'aklima Khanom', 'Police line School west Side', NULL, '01717954662', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-22 17:55:35', '2026-09-22 17:55:35', NULL),
	(42, 'CUST-0042', 'Abdul alim', 'Shalgariya,Pabna', NULL, '0183736636', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-22 18:04:56', '2026-09-22 18:04:56', NULL),
	(43, 'CUST-0043', 'Rana', 'Pabna', NULL, '01726363525', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-26 13:48:52', '2026-09-26 13:48:52', NULL),
	(44, 'CUST-0044', 'Ridoy Hossian', 'Monohorpur,Pabna', NULL, '0178829410', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-26 13:51:32', '2026-09-26 13:51:32', NULL),
	(45, 'CUST-0045', 'Azad vai', 'Shalgariya,Pabna', NULL, '01720292929', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-27 11:16:42', '2026-09-27 11:16:42', NULL),
	(46, 'CUST-0046', 'test', 'Tikori,Najirpur,pabna', NULL, '01326530330', 'shanto.cnits@gmail.com', NULL, '5345345345', '2000', NULL, NULL, NULL, 1, '2026-09-28 09:16:35', '2026-09-28 09:19:41', NULL),
	(47, 'CUST-0047', 'Mahabub Alom', 'Atuya Mohama Bad', NULL, '01720343846', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 15:39:05', '2026-09-30 15:39:05', NULL),
	(48, 'CUST-0048', 'Police Supper', 'Pabna', NULL, '01735353553', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 16:13:58', '2026-09-30 16:13:58', NULL),
	(49, 'CUST-0049', 'Shahin Alom', 'Sujanogor', NULL, '01739384848', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 16:27:57', '2026-09-30 16:27:57', NULL),
	(50, 'CUST-0050', 'Sweet vai', 'DC Banglor,pabna', NULL, '01733193028', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 16:30:34', '2026-09-30 16:30:34', NULL),
	(51, 'CUST-0051', 'Siraj Sir', 'Noynamoti', NULL, '01718022660', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 16:48:58', '2026-09-30 16:48:58', NULL),
	(52, 'CUST-0052', 'Robbin hossian', 'Dapuniya Pabna', NULL, '01744812481', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 17:16:38', '2026-09-30 17:16:38', NULL),
	(53, 'CUST-0053', 'Md.Faruk Hossian', 'Cartola gopalpur pabna', NULL, '01716013280', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 17:21:11', '2026-09-30 17:21:11', NULL),
	(54, 'CUST-0054', 'Rahat vai', 'Arifpur,Pabna', NULL, '01880248238', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-09-30 17:30:04', '2026-09-30 17:30:04', NULL),
	(55, 'CUST-0055', 'Shohel vai', 'Nolda notunpara', NULL, '01835651412', NULL, NULL, NULL, '12788', NULL, NULL, NULL, 1, '2026-10-01 11:50:46', '2026-10-08 20:07:24', NULL),
	(57, 'CUST-0001', 'Walking Customer', 'Showroom Counter', NULL, '01700000000', NULL, NULL, NULL, '0', NULL, NULL, NULL, 7, '2026-10-08 13:19:15', '2026-10-08 13:19:15', NULL);

-- Dumping structure for table runa_traders_db.customer_payment_details
DROP TABLE IF EXISTS `customer_payment_details`;
CREATE TABLE IF NOT EXISTS `customer_payment_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `paid_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_due_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_collection_date` date DEFAULT NULL,
  `payment_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_payment_details_customer_id_foreign` (`customer_id`),
  KEY `customer_payment_details_user_id_foreign` (`user_id`),
  CONSTRAINT `customer_payment_details_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `customer_payment_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.customer_payment_details: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.districts
DROP TABLE IF EXISTS `districts`;
CREATE TABLE IF NOT EXISTS `districts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `district_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `districts_user_id_foreign` (`user_id`),
  CONSTRAINT `districts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.districts: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.expenses
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `expense_type_id` bigint unsigned NOT NULL,
  `staff_id` bigint unsigned DEFAULT NULL,
  `expense_amount` decimal(10,2) NOT NULL,
  `expense_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `expenses_expense_type_id_foreign` (`expense_type_id`),
  KEY `expenses_user_id_foreign` (`user_id`),
  KEY `expenses_staff_id_foreign` (`staff_id`),
  CONSTRAINT `expenses_expense_type_id_foreign` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `expenses_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `expenses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.expenses: ~76 rows (approximately)
INSERT INTO `expenses` (`id`, `expense_type_id`, `staff_id`, `expense_amount`, `expense_details`, `date`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 6, NULL, 350.00, '?????????, ?????????????????????, ?????????????????????', '2026-09-01', 1, '2026-09-24 09:27:27', '2026-09-24 09:28:02'),
	(2, 1, NULL, 300.00, 'Basar wifi', '2026-09-01', 1, '2026-09-01 15:35:26', '2026-09-29 15:35:26'),
	(3, 8, NULL, 170.00, '', '2026-09-01', 1, '2026-09-01 15:37:58', '2026-09-29 15:37:58'),
	(4, 6, NULL, 70.00, 'Bora,Peyara', '2026-09-01', 1, '2026-09-01 15:37:58', '2026-09-29 15:37:58'),
	(5, 9, NULL, 90.00, 'Dawl, morich', '2026-09-02', 1, '2026-09-02 15:43:14', '2026-09-29 15:43:14'),
	(6, 6, NULL, 110.00, 'Banana,Ruti', '2026-09-02', 1, '2026-09-02 15:43:14', '2026-09-29 15:43:14'),
	(7, 10, NULL, 50.00, '', '2026-09-02', 1, '2026-09-02 15:45:17', '2026-09-29 15:45:17'),
	(8, 11, NULL, 300.00, '', '2026-09-03', 1, '2026-09-03 15:46:52', '2026-09-29 15:46:52'),
	(9, 10, NULL, 20.00, '', '2026-09-03', 1, '2026-09-03 15:52:15', '2026-09-29 15:52:15'),
	(10, 9, NULL, 230.00, 'Sugger,Trea pakge,Potato,Lebu etc', '2026-09-03', 1, '2026-09-03 15:52:15', '2026-09-29 15:52:15'),
	(11, 7, NULL, 80.00, '', '2026-09-03', 1, '2026-09-03 15:52:15', '2026-09-29 15:52:15'),
	(12, 6, NULL, 140.00, '', '2026-09-03', 1, '2026-09-03 15:52:15', '2026-09-29 15:52:15'),
	(13, 7, NULL, 100.00, 'battery and basin ana', '2026-09-05', 1, '2026-09-05 15:54:59', '2026-09-29 15:54:59'),
	(14, 6, NULL, 355.00, 'Tissue,dawel,biskit,coffee etc', '2026-09-05', 1, '2026-09-05 15:54:59', '2026-09-29 15:54:59'),
	(15, 9, NULL, 170.00, 'fish, potato,morich', '2026-09-06', 1, '2026-09-06 15:59:21', '2026-09-29 15:59:21'),
	(16, 8, NULL, 10.00, '', '2026-09-06', 1, '2026-09-06 15:59:21', '2026-09-29 15:59:21'),
	(17, 7, NULL, 30.00, '', '2026-09-06', 1, '2026-09-06 15:59:21', '2026-09-29 15:59:21'),
	(18, 6, NULL, 150.00, 'Cake,sandutch', '2026-09-06', 1, '2026-09-06 15:59:21', '2026-09-29 15:59:21'),
	(19, 12, NULL, 200.00, 'kamal,rana,sakil', '2026-09-06', 1, '2026-09-06 16:00:29', '2026-09-29 16:00:29'),
	(20, 9, NULL, 50.00, 'dawel,coffee', '2026-09-07', 1, '2026-09-07 16:02:48', '2026-09-29 16:02:48'),
	(21, 7, NULL, 280.00, 'godwen,battery,', '2026-09-07', 1, '2026-09-07 16:02:48', '2026-09-29 16:02:48'),
	(22, 8, NULL, 130.00, '', '2026-09-08', 1, '2026-09-08 16:05:39', '2026-09-29 16:05:39'),
	(23, 6, NULL, 30.00, '', '2026-09-08', 1, '2026-09-08 16:05:39', '2026-09-29 16:05:39'),
	(24, 11, NULL, 100.00, 'sompa cacir neoya', '2026-09-09', 1, '2026-09-09 16:16:36', '2026-09-29 16:16:36'),
	(25, 9, NULL, 20.00, 'dawel', '2026-09-09', 1, '2026-09-09 16:16:36', '2026-09-29 16:16:36'),
	(26, 7, NULL, 550.00, '', '2026-09-09', 1, '2026-09-09 16:16:36', '2026-09-29 16:16:36'),
	(27, 6, NULL, 665.00, 'biskit,photo copy,sugger,tea pakge,acarol etc', '2026-09-09', 1, '2026-09-09 16:16:36', '2026-09-29 16:16:36'),
	(28, 10, NULL, 20.00, 'fokir deoya', '2026-09-10', 1, '2026-09-10 16:27:40', '2026-09-29 16:27:40'),
	(29, 9, NULL, 55.00, 'bazar', '2026-09-10', 1, '2026-09-10 16:27:40', '2026-09-29 16:27:40'),
	(30, 7, NULL, 490.00, '', '2026-09-10', 1, '2026-09-10 16:27:40', '2026-09-29 16:27:40'),
	(31, 6, NULL, 620.00, 'anaros,kola,cake,coclet,singara', '2026-09-10', 1, '2026-09-10 16:27:40', '2026-09-29 16:27:40'),
	(32, 13, NULL, 100.00, '', '2026-09-13', 1, '2026-09-13 16:30:21', '2026-09-29 16:30:21'),
	(33, 9, NULL, 60.00, 'dawel', '2026-09-13', 1, '2026-09-13 16:30:21', '2026-09-29 16:30:21'),
	(34, 6, NULL, 10.00, '', '2026-09-13', 1, '2026-09-13 16:30:21', '2026-09-29 16:30:21'),
	(35, 11, NULL, 180.00, 'good night', '2026-09-14', 1, '2026-09-14 16:34:42', '2026-09-29 16:34:42'),
	(36, 9, NULL, 120.00, 'dawel dim,morich', '2026-09-14', 1, '2026-09-14 16:34:42', '2026-09-29 16:34:42'),
	(37, 7, NULL, 110.00, '', '2026-09-14', 1, '2026-09-14 16:34:42', '2026-09-29 16:34:42'),
	(38, 6, NULL, 240.00, 'sandutch,chocklet', '2026-09-14', 1, '2026-09-14 16:34:42', '2026-09-29 16:34:42'),
	(39, 9, NULL, 620.00, 'mass,tissue,potato,', '2026-09-16', 1, '2026-09-16 16:38:49', '2026-09-29 16:38:49'),
	(40, 7, NULL, 40.00, '', '2026-09-16', 1, '2026-09-16 16:38:49', '2026-09-29 16:38:49'),
	(41, 6, NULL, 300.00, 'customer appaoyen,doi,piyaju bora', '2026-09-16', 1, '2026-09-16 16:38:49', '2026-09-29 16:38:49'),
	(42, 14, NULL, 120.00, 'glass kina', '2026-09-17', 1, '2026-09-17 16:44:57', '2026-09-29 16:44:57'),
	(43, 11, NULL, 295.00, 'kaka osud kina,cacir neoya', '2026-09-19', 1, '2026-09-19 16:56:14', '2026-09-29 16:56:14'),
	(44, 10, NULL, 20.00, 'fokir deoya', '2026-09-19', 1, '2026-09-19 16:56:14', '2026-09-29 16:56:14'),
	(45, 8, NULL, 80.00, '', '2026-09-19', 1, '2026-09-19 16:56:14', '2026-09-29 16:56:14'),
	(46, 6, NULL, 800.00, 'doi,biskit,sendutch,kola cake etc', '2026-09-19', 1, '2026-09-19 16:56:14', '2026-09-29 16:56:14'),
	(47, 7, NULL, 140.00, 'van vara,battery vara', '2026-09-21', 1, '2026-09-21 16:58:37', '2026-09-29 16:58:37'),
	(48, 6, NULL, 1715.00, 'sweet,naspati,cake,kola,gam trap', '2026-09-21', 1, '2026-09-21 16:58:37', '2026-09-29 16:58:37'),
	(49, 9, NULL, 155.00, 'cul,dawl', '2026-09-22', 1, '2026-09-22 17:01:03', '2026-09-29 17:01:03'),
	(50, 6, NULL, 395.00, 'tissue,kola,doi,peyara', '2026-09-22', 1, '2026-09-22 17:01:03', '2026-09-29 17:01:03'),
	(51, 15, NULL, 5000.00, 'Aug to sep', '2026-09-23', 1, '2026-09-23 17:04:50', '2026-09-29 17:04:50'),
	(52, 16, NULL, 300.00, 'fitting bill', '2026-09-23', 1, '2026-09-23 17:08:16', '2026-09-29 17:08:16'),
	(53, 11, NULL, 1000.00, 'kaka neya', '2026-09-23', 1, '2026-09-23 17:08:16', '2026-09-29 17:08:16'),
	(54, 6, NULL, 30.00, 'coffee', '2026-09-23', 1, '2026-09-23 17:08:16', '2026-09-29 17:08:16'),
	(55, 17, NULL, 1400.00, 'akij door cisti vai kache pabo tk ta', '2026-09-23', 1, '2026-09-23 17:10:32', '2026-09-29 17:10:32'),
	(56, 10, NULL, 20.00, 'fokir deya', '2026-09-24', 1, '2026-09-24 17:14:56', '2026-09-29 17:14:56'),
	(57, 9, NULL, 90.00, 'dawel', '2026-09-24', 1, '2026-09-24 17:14:56', '2026-09-29 17:14:56'),
	(58, 6, NULL, 110.00, 'chif,sandutch', '2026-09-24', 1, '2026-09-24 17:14:56', '2026-09-29 17:14:56'),
	(59, 9, NULL, 140.00, 'sobji kina', '2026-09-26', 1, '2026-09-26 17:15:34', '2026-09-29 17:15:34'),
	(60, 8, NULL, 100.00, 'cop bill', '2026-09-27', 1, '2026-09-27 17:16:56', '2026-09-29 17:16:56'),
	(61, 7, NULL, 200.00, 'van vara', '2026-09-27', 1, '2026-09-27 17:16:56', '2026-09-29 17:16:56'),
	(62, 9, NULL, 105.00, 'peya,morich,ada', '2026-09-28', 1, '2026-09-28 17:19:55', '2026-09-29 17:19:55'),
	(63, 7, NULL, 155.00, 'pubali bank chaque retruns', '2026-09-28', 1, '2026-09-28 17:19:55', '2026-09-29 17:19:55'),
	(64, 6, NULL, 40.00, 'siggarte,coffee', '2026-09-28', 1, '2026-09-28 17:19:55', '2026-09-29 17:19:55'),
	(65, 18, NULL, 13716.00, '', '2026-09-30', 1, '2026-09-30 17:34:25', '2026-09-30 17:34:25'),
	(66, 5, NULL, 8000.00, 'kalacadpara godaun vara', '2026-09-30', 1, '2026-09-30 17:36:28', '2026-09-30 17:36:28'),
	(67, 4, NULL, 10000.00, 'Abul Vai dokan vara', '2026-09-30', 1, '2026-09-30 17:36:28', '2026-09-30 17:36:28'),
	(68, 3, NULL, 35000.00, 'main showroom vara', '2026-09-30', 1, '2026-09-30 17:36:28', '2026-09-30 17:36:28'),
	(69, 2, 4, 15000.00, 'September', '2026-09-30', 1, '2026-09-30 17:37:24', '2026-09-30 17:37:24'),
	(70, 2, 5, 10000.00, 'September', '2026-09-30', 1, '2026-09-30 17:37:55', '2026-09-30 17:37:55'),
	(71, 2, 3, 10000.00, 'september', '2026-09-30', 1, '2026-09-30 17:38:31', '2026-09-30 17:38:31'),
	(72, 2, 6, 7000.00, 'September', '2026-09-30', 1, '2026-09-30 17:38:58', '2026-09-30 17:38:58'),
	(73, 9, NULL, 110.00, 'Alu,dim,morich', '2026-09-30', 1, '2026-09-30 18:16:26', '2026-09-30 18:16:26'),
	(74, 8, NULL, 55.00, 'copy bill', '2026-09-30', 1, '2026-09-30 18:16:26', '2026-09-30 18:16:26'),
	(75, 7, NULL, 150.00, '', '2026-09-30', 1, '2026-09-30 18:16:26', '2026-09-30 18:16:26'),
	(76, 6, NULL, 120.00, 'sandutch', '2026-09-30', 1, '2026-09-30 18:16:26', '2026-09-30 18:16:26');

-- Dumping structure for table runa_traders_db.expense_types
DROP TABLE IF EXISTS `expense_types`;
CREATE TABLE IF NOT EXISTS `expense_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `expense_types_user_id_foreign` (`user_id`),
  CONSTRAINT `expense_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.expense_types: ~18 rows (approximately)
INSERT INTO `expense_types` (`id`, `type_name`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 'Internet Bill', 'Active', 1, '2026-08-25 14:21:17', '2026-08-25 14:21:17'),
	(2, 'Sallery', 'Active', 1, '2026-08-27 15:22:24', '2026-08-27 15:22:24'),
	(3, 'Show Room -1', 'Active', 1, '2026-08-30 18:01:41', '2026-08-30 18:01:41'),
	(4, 'Show Room-2', 'Active', 1, '2026-08-30 18:02:19', '2026-08-30 18:02:19'),
	(5, 'Godowen', 'Active', 1, '2026-08-30 18:03:21', '2026-08-30 18:03:21'),
	(6, '????????????????????????', 'Active', 1, '2026-09-24 09:26:19', '2026-09-24 09:26:19'),
	(7, 'Transports cost', 'Active', 1, '2026-09-29 15:33:00', '2026-09-29 15:33:00'),
	(8, 'Photo Copy Bill', 'Active', 1, '2026-09-29 15:36:05', '2026-09-29 15:36:05'),
	(9, 'Vegetable Curry', 'Active', 1, '2026-09-29 15:40:45', '2026-09-29 15:40:45'),
	(10, 'Helping cost', 'Active', 1, '2026-09-29 15:44:56', '2026-09-29 15:44:56'),
	(11, 'Owner Cost/kaka', 'Active', 1, '2026-09-29 15:46:30', '2026-09-29 15:46:30'),
	(12, 'Lunch bill', 'Active', 1, '2026-09-29 16:00:00', '2026-09-29 16:00:00'),
	(13, 'telephone cost', 'Active', 1, '2026-09-29 16:28:46', '2026-09-29 16:28:46'),
	(14, 'inventory cost', 'Active', 1, '2026-09-29 16:44:30', '2026-09-29 16:44:30'),
	(15, 'VAT', 'Active', 1, '2026-09-29 17:03:40', '2026-09-29 17:03:40'),
	(16, 'Mistri Bill', 'Active', 1, '2026-09-29 17:06:41', '2026-09-29 17:06:41'),
	(17, 'courier bill', 'Active', 1, '2026-09-29 17:09:42', '2026-09-29 17:09:42'),
	(18, 'Current Bill', 'Active', 1, '2026-09-30 17:34:04', '2026-09-30 17:34:04');

-- Dumping structure for table runa_traders_db.failed_jobs
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.jobs
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.jobs: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.job_batches
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.job_batches: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.locations
DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `locations_user_id_foreign` (`user_id`),
  CONSTRAINT `locations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.locations: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.migrations
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.migrations: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.opening_balances
DROP TABLE IF EXISTS `opening_balances`;
CREATE TABLE IF NOT EXISTS `opening_balances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `date` date NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `opening_balances_date_user_id_unique` (`date`,`user_id`),
  KEY `opening_balances_user_id_foreign` (`user_id`),
  CONSTRAINT `opening_balances_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.opening_balances: ~0 rows (approximately)
INSERT INTO `opening_balances` (`id`, `amount`, `date`, `note`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 5000.00, '2026-10-08', 'Cash drawer morning float', 2, NULL, NULL);

-- Dumping structure for table runa_traders_db.orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_total` decimal(10,2) DEFAULT NULL,
  `return_adjustment_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `due_amount` decimal(10,2) DEFAULT NULL,
  `previous_due_amount` decimal(10,2) DEFAULT NULL,
  `order_note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `customer_id` bigint unsigned DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orders_customer_id_foreign` (`customer_id`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.orders: ~1 rows (approximately)

-- Dumping structure for table runa_traders_db.order_details
DROP TABLE IF EXISTS `order_details`;
CREATE TABLE IF NOT EXISTS `order_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `selling_price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_details_order_id_foreign` (`order_id`),
  KEY `order_details_product_id_foreign` (`product_id`),
  KEY `order_details_user_id_foreign` (`user_id`),
  CONSTRAINT `order_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.order_details: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.order_payment_details
DROP TABLE IF EXISTS `order_payment_details`;
CREATE TABLE IF NOT EXISTS `order_payment_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `transaction_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_collection_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_payment_details_order_id_foreign` (`order_id`),
  KEY `order_payment_details_user_id_foreign` (`user_id`),
  CONSTRAINT `order_payment_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_payment_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.order_payment_details: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.password_reset_tokens
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.personal_access_tokens
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.personal_access_tokens: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost_price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sell_price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_code` json NOT NULL,
  `brand_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `door_side` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_category_id` bigint unsigned DEFAULT NULL,
  `unit_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tile_size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sqft_per_box` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pcs_per_box` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surface_finish` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_brand_id_foreign` (`brand_id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_sub_category_id_foreign` (`sub_category_id`),
  KEY `products_unit_id_foreign` (`unit_id`),
  KEY `products_user_id_foreign` (`user_id`),
  CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_sub_category_id_foreign` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=741 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.products: ~1 rows (approximately)
INSERT INTO `products` (`id`, `img_url`, `product_name`, `quantity`, `cost_price`, `sell_price`, `status`, `product_code`, `brand_id`, `category_id`, `door_side`, `sub_category_id`, `unit_id`, `user_id`, `created_at`, `updated_at`, `tile_size`, `sqft_per_box`, `pcs_per_box`, `grade`, `surface_finish`) VALUES
	(740, NULL, 'Fresh Ceramics 60x60 Statuario Marble Tiles', '150', '950.00', '1200.00', 'active', '["FC-6060-STAT", "894100123456"]', 24, 30, NULL, NULL, 4, 1, '2026-10-09 13:18:41', '2026-10-09 19:51:24', '24"x24"', '16.0', '4', 'Grade A', 'Glossy');

-- Dumping structure for table runa_traders_db.product_returns
DROP TABLE IF EXISTS `product_returns`;
CREATE TABLE IF NOT EXISTS `product_returns` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `due_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_returns_order_id_foreign` (`order_id`),
  KEY `product_returns_customer_id_foreign` (`customer_id`),
  KEY `product_returns_user_id_foreign` (`user_id`),
  CONSTRAINT `product_returns_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `product_returns_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `product_returns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.product_returns: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.purchases
DROP TABLE IF EXISTS `purchases`;
CREATE TABLE IF NOT EXISTS `purchases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referance_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_payable_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `grand_subtotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `return_adjustment_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `attach_document` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplier_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchases_supplier_id_foreign` (`supplier_id`),
  KEY `purchases_user_id_foreign` (`user_id`),
  CONSTRAINT `purchases_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchases_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.purchases: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.purchase_order_details
DROP TABLE IF EXISTS `purchase_order_details`;
CREATE TABLE IF NOT EXISTS `purchase_order_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `purchase_id` bigint unsigned NOT NULL,
  `quantity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost_price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchase_order_details_product_id_foreign` (`product_id`),
  KEY `purchase_order_details_purchase_id_foreign` (`purchase_id`),
  KEY `purchase_order_details_user_id_foreign` (`user_id`),
  CONSTRAINT `purchase_order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_order_details_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_order_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.purchase_order_details: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.purchase_payment_details
DROP TABLE IF EXISTS `purchase_payment_details`;
CREATE TABLE IF NOT EXISTS `purchase_payment_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchases_id` bigint unsigned NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_due_collection_date` date DEFAULT NULL,
  `purchase_order_details_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchase_payment_details_purchase_order_details_id_foreign` (`purchase_order_details_id`),
  KEY `purchase_payment_details_purchases_id_foreign` (`purchases_id`),
  KEY `purchase_payment_details_user_id_foreign` (`user_id`),
  CONSTRAINT `purchase_payment_details_purchase_order_details_id_foreign` FOREIGN KEY (`purchase_order_details_id`) REFERENCES `purchase_order_details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `purchase_payment_details_purchases_id_foreign` FOREIGN KEY (`purchases_id`) REFERENCES `purchases` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_payment_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.purchase_payment_details: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.purchase_returns
DROP TABLE IF EXISTS `purchase_returns`;
CREATE TABLE IF NOT EXISTS `purchase_returns` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` bigint unsigned NOT NULL,
  `supplier_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `due_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `quantity` int NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_returns_purchase_id_foreign` (`purchase_id`),
  KEY `purchase_returns_supplier_id_foreign` (`supplier_id`),
  KEY `purchase_returns_product_id_foreign` (`product_id`),
  KEY `purchase_returns_user_id_foreign` (`user_id`),
  CONSTRAINT `purchase_returns_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_returns_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_returns_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_returns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.purchase_returns: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.sessions: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.sub_categories
DROP TABLE IF EXISTS `sub_categories`;
CREATE TABLE IF NOT EXISTS `sub_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sub_category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sub_categories_category_id_foreign` (`category_id`),
  KEY `sub_categories_user_id_foreign` (`user_id`),
  CONSTRAINT `sub_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sub_categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.sub_categories: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.suppliers
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `supplier_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_payable_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `suppliers_user_id_foreign` (`user_id`),
  CONSTRAINT `suppliers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.suppliers: ~9 rows (approximately)
INSERT INTO `suppliers` (`id`, `supplier_id`, `name`, `company`, `mobile`, `address`, `email`, `img_url`, `purchase_payable_amount`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
	(2, 'SUP-10002', 'Md.Chishty', 'Akij Particale Board Mills LTD', '01712-642966', 'Mymensingh', '', NULL, '65808', 'Active', 1, '2026-09-05 09:32:40', '2026-10-04 12:39:25'),
	(3, 'SUP-10003', 'Nur Nobi', 'RFL', '01313070871', 'Badda,Dhaka', '', 'uploads/supplier-img/1-1790775896-1000015190.jpg', '0', 'Active', 1, '2026-09-29 13:39:08', '2026-09-30 17:44:56'),
	(4, 'SUP-10004', 'Rubel Mistri', '', '01772308034', 'Pabna', '', 'uploads/supplier-img/1-1790773557-WhatsApp_Image_2026-09-29_at_4.38.14_PM.jpeg', '0', 'Active', 1, '2026-09-29 14:13:22', '2026-09-30 17:05:57'),
	(5, 'SUP-10005', 'Bokul vai', 'Oriental Eco woods Limited', '017700769972', 'Panshi,Dhaka', '', 'uploads/supplier-img/1-1790775866-1000015398.jpg', '0', 'Active', 1, '2026-09-30 16:38:44', '2026-09-30 17:44:26'),
	(6, 'SUP-10006', 'Md.Masud biswas', 'M/S Shohan Tradres', '01716076200', 'Chapa morsid ,pabna', '', 'uploads/supplier-img/1-1790775833-1000015384.jpg', '0', 'Active', 1, '2026-09-30 17:26:14', '2026-09-30 17:43:53'),
	(7, 'SUP-10007', 'Rizvi', 'Akhi Enterprise', '01819270218', '26/1,Hazi Osman Goni Road, Dhaka-1000', 'akhienterprise999@gmail.com', 'uploads/supplier-img/1-1791115648-1000015791.jpg', '0', 'Active', 1, '2026-10-03 09:48:06', '2026-10-04 16:07:28'),
	(8, 'SUP-10008', 'Md.Saidul Vai ZM', 'Mostofa Metal Industries LTD', '01709958999', 'Motaleb Mention Dhaka', '', 'uploads/supplier-img/1-1791115554-1000015697.jpg', '208822', 'Active', 1, '2026-10-04 10:25:14', '2026-10-04 16:05:54'),
	(9, 'SUP-10009', 'Shahin Alam', 'Satter Metal Industries.LTD', '01321117339', 'Dhaka', '', 'uploads/supplier-img/1-1791115413-1000015774.jpg', '0', 'Active', 1, '2026-10-04 10:46:07', '2026-10-04 16:03:33'),
	(10, 'SUP-10010', 'Tusur vai(SR)', 'RFL(Sinks/Gessere)', '01810155582', 'Pabna', '', 'uploads/supplier-img/1-1791115370-1000015790.jpg', '1100', 'Active', 1, '2026-10-04 14:52:59', '2026-10-08 20:06:29');

-- Dumping structure for table runa_traders_db.supplier_due_collections
DROP TABLE IF EXISTS `supplier_due_collections`;
CREATE TABLE IF NOT EXISTS `supplier_due_collections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `paid_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_payable_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_collection_date` date DEFAULT NULL,
  `supplier_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `supplier_due_collections_supplier_id_foreign` (`supplier_id`),
  KEY `supplier_due_collections_user_id_foreign` (`user_id`),
  CONSTRAINT `supplier_due_collections_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `supplier_due_collections_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.supplier_due_collections: ~1 rows (approximately)
INSERT INTO `supplier_due_collections` (`id`, `paid_amount`, `due_amount`, `discount_amount`, `purchase_payable_amount`, `payment_method`, `transaction_id`, `payment_status`, `due_collection_date`, `supplier_id`, `user_id`, `created_at`, `updated_at`) VALUES
	(2, '1000', '1100', '0', '2100', 'Cash', 'TRX-SUPP-PAY-1', 'Partial', '2026-10-08', 10, 7, '2026-10-08 14:06:29', '2026-10-08 14:06:29');

-- Dumping structure for table runa_traders_db.thanas
DROP TABLE IF EXISTS `thanas`;
CREATE TABLE IF NOT EXISTS `thanas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Thana_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_id` bigint unsigned NOT NULL,
  `upazila_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `thanas_district_id_foreign` (`district_id`),
  KEY `thanas_upazila_id_foreign` (`upazila_id`),
  KEY `thanas_user_id_foreign` (`user_id`),
  CONSTRAINT `thanas_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `thanas_upazila_id_foreign` FOREIGN KEY (`upazila_id`) REFERENCES `upazilas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `thanas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.thanas: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.units
DROP TABLE IF EXISTS `units`;
CREATE TABLE IF NOT EXISTS `units` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `units_user_id_foreign` (`user_id`),
  CONSTRAINT `units_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.units: ~4 rows (approximately)
INSERT INTO `units` (`id`, `unit_name`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 'Pcs', 'active', 1, '2026-08-23 08:32:18', '2026-08-23 08:32:18'),
	(2, 'Pcs', 'active', 7, '2026-10-08 12:54:10', '2026-10-08 12:54:10'),
	(4, 'Box', 'active', 1, '2026-10-09 13:09:00', '2026-10-09 13:09:00'),
	(5, 'Sq.Ft', 'active', 1, '2026-10-09 13:09:00', '2026-10-09 13:09:00');

-- Dumping structure for table runa_traders_db.upazilas
DROP TABLE IF EXISTS `upazilas`;
CREATE TABLE IF NOT EXISTS `upazilas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `upazila_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `upazilas_district_id_foreign` (`district_id`),
  KEY `upazilas_user_id_foreign` (`user_id`),
  CONSTRAINT `upazilas_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `upazilas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.upazilas: ~0 rows (approximately)

-- Dumping structure for table runa_traders_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','approved') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'users',
  `permissions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table runa_traders_db.users: ~6 rows (approximately)
INSERT INTO `users` (`id`, `img_url`, `name`, `email`, `mobile`, `password`, `otp`, `otp_expires_at`, `status`, `role`, `permissions`, `created_at`, `updated_at`) VALUES
	(1, NULL, 'Admin', 'admin@gmail.com', '01975-703216', '$2b$10$HRqSPAfwBYJnEzyluL58deHLyTBnjCxgc3BpRF.Y/qj.JR4xQAS26', '0', NULL, 'approved', 'admin', NULL, '2026-08-23 08:27:10', '2026-10-08 20:16:20'),
	(2, NULL, 'Md Skil Ahmed', NULL, '01738339568', '$2y$12$AIyWCXepJ7VA7p/yK6Jz5e7V4NOk8BjngB5lgE1C/FWJrUr.Z0lyu', '0', NULL, 'approved', 'manager', NULL, '2026-08-25 14:23:34', '2026-08-25 14:23:34'),
	(3, NULL, 'Md Skil Ahmed', NULL, '01738339568', '$2y$12$B7Od2TM8gSLI25a6gm5KOu9wl.Nguouenn.btEnyaaWrrtoBYVLX2', '0', NULL, 'approved', 'cashier', NULL, '2026-09-29 15:20:59', '2026-09-29 15:20:59'),
	(4, NULL, 'MD.kamal Hossian', NULL, '01772308034', '$2y$12$UL21ZY5Z03DjVTaomVwi0uPZbLy55YQ8QrpdImMUmT4ZLmO0UIljK', '0', NULL, 'approved', 'manager', NULL, '2026-09-29 15:25:39', '2026-09-29 15:25:39'),
	(5, NULL, 'MD. Rana Hossian', NULL, '01751203104', '$2y$12$pAKOKbDkUUb2ZsVazjjC5.uIYQKJSVla8vqLxUd8Zt/./61R0w5oO', '0', NULL, 'approved', 'manager', NULL, '2026-09-29 15:27:59', '2026-09-29 15:27:59'),
	(6, NULL, 'Md.Abul Hossian', NULL, '01715842083', '$2y$12$100GHa/D4SDh7QoTjBY8hOvjE8aWHa8tVHL1/Cl6sYJvT3PZkNxV6', '0', NULL, 'approved', 'staff', NULL, '2026-09-29 15:29:28', '2026-09-29 15:29:28');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
