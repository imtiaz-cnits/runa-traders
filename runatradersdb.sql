-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 13, 2026 at 02:33 AM
-- Server version: 8.0.45
-- PHP Version: 8.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `runatradersdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `logo`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
(3, 'Fresh Ceramics', NULL, 'active', 1, '2026-10-11 06:05:21', '2026-10-11 06:05:21'),
(4, 'FRESH SANITARY', NULL, 'active', 1, '2026-10-11 07:32:48', '2026-10-11 07:32:48'),
(5, 'ASTRA', NULL, 'active', 1, '2026-10-11 07:33:06', '2026-10-11 07:33:06'),
(6, 'SATTAR METAL', NULL, 'active', 1, '2026-10-11 07:33:21', '2026-10-11 07:33:21'),
(7, 'RFL', NULL, 'active', 1, '2026-10-11 07:34:29', '2026-10-11 07:34:29'),
(8, 'MOON GALLARY', NULL, 'active', 1, '2026-10-11 07:35:15', '2026-10-11 07:35:15'),
(9, 'RASEL TRADING', NULL, 'active', 1, '2026-10-11 07:35:52', '2026-10-11 07:35:52');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `category_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `img_url`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
(4, 'Tiles', NULL, 'active', 1, '2026-10-11 06:05:50', '2026-10-11 06:05:50'),
(5, 'Basin', NULL, 'active', 1, '2026-10-11 06:07:40', '2026-10-11 06:07:40'),
(6, 'Commodes', NULL, 'active', 1, '2026-10-11 07:24:20', '2026-10-11 07:24:20'),
(7, 'PAN', NULL, 'active', 1, '2026-10-11 07:44:22', '2026-10-11 07:44:22'),
(8, 'FAUCET', NULL, 'active', 1, '2026-10-11 08:22:50', '2026-10-11 08:22:50');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint UNSIGNED NOT NULL,
  `customer_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_details` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_due_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district_id` bigint UNSIGNED DEFAULT NULL,
  `upazila_id` bigint UNSIGNED DEFAULT NULL,
  `thana_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_id`, `customer_name`, `address_details`, `date`, `mobile`, `email`, `img_url`, `nid`, `previous_due_amount`, `district_id`, `upazila_id`, `thana_id`, `user_id`, `created_at`, `updated_at`, `location_id`) VALUES
(1, 'CUST-0001', 'SAYEM', NULL, NULL, '01742501636', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-10-11 08:28:40', '2026-10-11 08:28:40', NULL),
(2, 'CUST-0002', 'MD ABDUL MAJID', 'KOLABAGAN ,PABNA', NULL, '01716836425', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-10-11 09:27:32', '2026-10-11 09:27:32', NULL),
(3, 'CUST-0003', 'Shopna khan', 'Autapara,pabna', NULL, '01736407020', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-10-11 10:33:08', '2026-10-11 10:33:08', NULL),
(4, 'CUST-0004', 'KHOKON VAI', 'KRISHNOPUR,PABNA', NULL, '01714231362', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-10-12 06:56:05', '2026-10-12 06:56:05', NULL),
(5, 'CUST-0005', 'ENG TONMOY', NULL, NULL, '01571179604', NULL, NULL, NULL, '0', NULL, NULL, NULL, 1, '2026-10-12 12:35:03', '2026-10-12 12:35:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_payment_details`
--

CREATE TABLE `customer_payment_details` (
  `id` bigint UNSIGNED NOT NULL,
  `paid_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_due_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_collection_date` date DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` bigint UNSIGNED NOT NULL,
  `district_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint UNSIGNED NOT NULL,
  `expense_type_id` bigint UNSIGNED NOT NULL,
  `staff_id` bigint UNSIGNED DEFAULT NULL,
  `expense_amount` decimal(10,2) NOT NULL,
  `expense_details` longtext COLLATE utf8mb4_unicode_ci,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_types`
--

CREATE TABLE `expense_types` (
  `id` bigint UNSIGNED NOT NULL,
  `type_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `opening_balances`
--

CREATE TABLE `opening_balances` (
  `id` bigint UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `date` date NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `order_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_total` decimal(10,2) DEFAULT NULL,
  `return_adjustment_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `due_amount` decimal(10,2) DEFAULT NULL,
  `previous_due_amount` decimal(10,2) DEFAULT NULL,
  `order_note` longtext COLLATE utf8mb4_unicode_ci,
  `customer_id` bigint UNSIGNED DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_no`, `sub_total`, `return_adjustment_amount`, `paid_amount`, `delivery_charge`, `discount_amount`, `due_amount`, `previous_due_amount`, `order_note`, `customer_id`, `invoice_date`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'ORD-20261011-1917', 1800.00, 0.00, 1700.00, 0.00, 100.00, 0.00, 0.00, NULL, 2, '2026-10-11', 1, '2026-10-11 09:28:22', '2026-10-11 09:28:22'),
(2, 'ORD-20261011-5203', 1185.00, 0.00, 1185.00, 0.00, 0.00, 0.00, 0.00, NULL, 3, '2026-10-11', 1, '2026-10-11 10:34:58', '2026-10-11 10:34:58'),
(3, 'ORD-20261012-3231', 1015.00, 0.00, 950.00, 0.00, 65.00, 0.00, 0.00, NULL, 4, '2026-10-12', 1, '2026-10-12 06:56:56', '2026-10-12 06:56:56'),
(4, 'ORD-20261012-1313', 123120.00, 0.00, 0.00, 0.00, 123120.00, 0.00, 0.00, NULL, 5, '2026-10-12', 1, '2026-10-12 12:36:25', '2026-10-12 12:36:25'),
(5, 'ORD-20261012-6560', 123120.00, 0.00, 123120.00, 0.00, 0.00, 0.00, 0.00, NULL, 5, '2026-10-12', 1, '2026-10-12 12:42:37', '2026-10-12 12:42:37');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `selling_price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `price`, `selling_price`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 23, '1', '1500', '1800', 1, '2026-10-11 09:28:22', '2026-10-11 09:28:22'),
(2, 2, 46, '1', '950', '1185', 1, '2026-10-11 10:34:58', '2026-10-11 10:34:58'),
(3, 3, 52, '1', '813', '1015', 1, '2026-10-12 06:56:56', '2026-10-12 06:56:56'),
(4, 4, 1, '7', '1445.76', '1520', 1, '2026-10-12 12:36:25', '2026-10-12 12:36:25'),
(5, 4, 7, '74', '1445.76', '1520', 1, '2026-10-12 12:36:25', '2026-10-12 12:36:25'),
(6, 5, 1, '7', '1445.76', '1520', 1, '2026-10-12 12:42:37', '2026-10-12 12:42:37'),
(7, 5, 7, '74', '1445.76', '1520', 1, '2026-10-12 12:42:37', '2026-10-12 12:42:37');

-- --------------------------------------------------------

--
-- Table structure for table `order_payment_details`
--

CREATE TABLE `order_payment_details` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `transaction_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_collection_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_payment_details`
--

INSERT INTO `order_payment_details` (`id`, `order_id`, `paid_amount`, `discount_amount`, `transaction_id`, `payment_method`, `due_collection_date`, `payment_status`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1700.00, NULL, NULL, 'Cash', '2026-10-11', 'Paid', 1, '2026-10-11 09:28:22', '2026-10-11 09:28:22'),
(2, 2, 1185.00, NULL, NULL, 'Cash', '2026-10-11', 'Paid', 1, '2026-10-11 10:34:58', '2026-10-11 10:34:58'),
(3, 3, 950.00, NULL, NULL, 'Cash', '2026-10-12', 'Paid', 1, '2026-10-12 06:56:56', '2026-10-12 06:56:56'),
(4, 4, 0.00, NULL, NULL, 'Cash', '2026-10-12', 'Paid', 1, '2026-10-12 12:36:25', '2026-10-12 12:36:25'),
(5, 5, 123120.00, NULL, NULL, 'Cash', '2026-10-12', 'Paid', 1, '2026-10-12 12:42:37', '2026-10-12 12:42:37');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost_price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sell_price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_code` json NOT NULL,
  `brand_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `door_side` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tile_size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sqft_per_box` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pcs_per_box` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surface_finish` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_category_id` bigint UNSIGNED DEFAULT NULL,
  `unit_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `img_url`, `product_name`, `quantity`, `cost_price`, `sell_price`, `status`, `product_code`, `brand_id`, `category_id`, `door_side`, `tile_size`, `sqft_per_box`, `pcs_per_box`, `grade`, `surface_finish`, `sub_category_id`, `unit_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, NULL, '6PGVT46', '116', '1445.76', '1520', 'active', '[\"PRD-0001\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 06:12:41', '2026-10-11 06:12:41'),
(5, NULL, '6PGVT12', '73', '1445.75', '1520', 'active', '[\"PRD-0005\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 06:23:28', '2026-10-11 06:23:28'),
(6, NULL, '6PGVT03', '95', '1445.76', '1520', 'active', '[\"PRD-0006\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 06:26:39', '2026-10-11 06:26:39'),
(7, NULL, '6PGVT59', '0', '1445.76', '1520', 'active', '[\"PRD-0007\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 07:22:00', '2026-10-11 07:22:00'),
(8, NULL, '6PGVT55', '75', '1445.76', '1520', 'active', '[\"PRD-0008\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 07:23:32', '2026-10-11 07:23:32'),
(9, NULL, '6PGVT47', '0', '1445.76', '1520', 'active', '[\"PRD-0009\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 07:24:49', '2026-10-11 07:24:49'),
(10, NULL, '6PGVT29', '0', '1445.76', '1520', 'active', '[\"PRD-0010\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 07:26:28', '2026-10-11 07:26:28'),
(11, NULL, '6PGVT53', '0', '1445.76', '1520', 'active', '[\"PRD-0011\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 07:27:38', '2026-10-11 07:27:38'),
(12, NULL, '6PGVT60', '0', '1445.76', '1520', 'active', '[\"PRD-0012\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 07:28:26', '2026-10-11 07:28:26'),
(13, NULL, '6PGVT40', '0', '1445.76', '1520', 'active', '[\"PRD-0013\"]', 3, 4, NULL, '24\"x24\"', '16', '4', 'Grade A', 'PGVT (Polished Glazed)', NULL, 2, 1, '2026-10-11 07:29:37', '2026-10-11 07:29:37'),
(14, NULL, 'LIO COMOD (BEIGE)', '2', '13300', '15000', 'active', '[\"PRD-0014\"]', 4, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:40:29', '2026-10-11 07:40:29'),
(15, NULL, 'REVO COMOD (BEIGE)', '4', '7600', '8600', 'active', '[\"PRD-0015\"]', 4, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:43:31', '2026-10-11 07:43:31'),
(16, NULL, 'RIVA PAN (BEIGE)', '5', '1300', '1500', 'active', '[\"PRD-0016\"]', 4, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:47:10', '2026-10-11 07:47:10'),
(17, NULL, 'PARIS BASAIN(BEIGE)', '5', '2500', '2800', 'active', '[\"PRD-0017\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:49:19', '2026-10-11 07:49:19'),
(18, NULL, 'SILVIA BASIN(BEIGE)', '5', '2800', '3200', 'active', '[\"PRD-0018\"]', 9, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:51:18', '2026-10-11 07:51:18'),
(19, NULL, 'REVO BASAIN BIG (BEIGE)', '5', '3800', '4400', 'active', '[\"PRD-0019\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:52:22', '2026-10-11 07:52:22'),
(20, NULL, 'LIO COMOD (WHITE)', '10', '13300', '15000', 'active', '[\"PRD-0020\"]', 4, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:54:07', '2026-10-11 07:54:07'),
(21, NULL, 'REVO COMOD(WHITE)', '12', '7600', '8600', 'active', '[\"PRD-0021\"]', 4, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:55:57', '2026-10-11 07:55:57'),
(22, NULL, 'OSLO COMOD(WHITE)', '7', '6600', '7600', 'active', '[\"PRD-0022\"]', 4, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:56:33', '2026-10-11 07:56:33'),
(23, NULL, 'ELIN PAN(WHITE)', '19', '1500', '1800', 'active', '[\"PRD-0023\"]', 4, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 07:59:41', '2026-10-11 07:59:41'),
(24, NULL, 'RIVA PAN(WHITE)', '22', '1300', '1500', 'active', '[\"PRD-0024\"]', 4, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:01:08', '2026-10-11 08:01:08'),
(25, NULL, 'LETO PAN(WHITE)', '20', '950', '1200', 'active', '[\"PRD-0025\"]', 4, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:02:09', '2026-10-11 08:02:09'),
(26, NULL, 'MAVE BASIN(WHITE)', '6', '3900', '4200', 'active', '[\"PRD-0026\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:02:56', '2026-10-11 08:02:56'),
(27, NULL, 'PARIS BASIN(WHITE)', '18', '2500', '2800', 'active', '[\"PRD-0027\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:03:44', '2026-10-11 08:03:44'),
(28, NULL, 'SILVIA BASIN(WHITE)', '16', '2800', '3200', 'active', '[\"PRD-0028\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:04:30', '2026-10-11 08:04:30'),
(29, NULL, 'IRINA BASAIN(WHITE)', '1', '2800', '3500', 'active', '[\"PRD-0029\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:05:15', '2026-10-11 08:05:15'),
(30, NULL, 'REVO BASIN BIG(WHITE)', '11', '3800', '4400', 'active', '[\"PRD-0030\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:06:20', '2026-10-11 08:06:20'),
(31, NULL, 'REVO BASIN 50CM(WHITE)', '15', '3400', '3800', 'active', '[\"PRD-0031\"]', 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:07:49', '2026-10-11 08:07:49'),
(32, NULL, 'MOVING SHOWER PRO 0098', '5', '1765', '2200', 'active', '[\"PRD-0032\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:28:07', '2026-10-11 08:28:07'),
(33, NULL, 'STAR MOVING SHOWER 0031', '5', '1697', '2120', 'active', '[\"PRD-0033\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:32:41', '2026-10-11 08:32:41'),
(34, NULL, '3^ ROUND SHOWER 131', '5', '1697', '2120', 'active', '[\"PRD-0034\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:33:59', '2026-10-11 08:33:59'),
(35, NULL, 'MOVING SHOWER SUPER 0033', '5', '1561', '1950', 'active', '[\"PRD-0035\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:35:07', '2026-10-11 08:35:07'),
(36, NULL, '12^^ BASIN MIXER 78622', '3', '6800', '8495', 'active', '[\"PRD-0036\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:36:59', '2026-10-11 08:36:59'),
(37, NULL, 'PREMIUM SOAP CASE 0097', '10', '541', '675', 'active', '[\"PRD-0037\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:38:31', '2026-10-11 08:38:31'),
(38, NULL, 'MIKE SHOWER J01', '5', '1356', '1695', 'active', '[\"PRD-0038\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:39:55', '2026-10-11 08:39:55'),
(39, NULL, 'RING TOWEL RAIL 786117', '12', '609', '760', 'active', '[\"PRD-0039\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:41:17', '2026-10-11 08:41:17'),
(40, NULL, '24^^GLASS SELF GS24', '6', '677', '845', 'active', '[\"PRD-0040\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:42:33', '2026-10-11 08:42:33'),
(41, NULL, '4^^ROUND SHOWER 134', '5', '1833', '2290', 'active', '[\"PRD-0041\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:43:46', '2026-10-11 08:43:46'),
(42, NULL, 'BASIN PILAR COCK 78620', '6', '2105', '2630', 'active', '[\"PRD-0042\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:44:58', '2026-10-11 08:44:58'),
(43, NULL, 'PUSH SHOWER ROYEL PRO 777H', '12', '813', '1015', 'active', '[\"PRD-0043\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:46:26', '2026-10-11 08:46:26'),
(44, NULL, '12^^PILAR COCK 2225', '3', '3670', '4585', 'active', '[\"PRD-0044\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:47:44', '2026-10-11 08:47:44'),
(45, NULL, 'PUSH SHOWER 777N', '12', '857', '1070', 'active', '[\"PRD-0045\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:48:48', '2026-10-11 08:48:48'),
(46, NULL, '5^^FLOOR DRAIN N312', '9', '950', '1185', 'active', '[\"PRD-0046\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:50:11', '2026-10-11 08:50:11'),
(47, NULL, 'TOP PILAR COCK SQURE 2221', '4', '2650', '3300', 'active', '[\"PRD-0047\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:51:33', '2026-10-11 08:51:33'),
(48, NULL, 'ANGLE STOP COCK 2023', '10', '677', '845', 'active', '[\"PRD-0048\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:52:44', '2026-10-11 08:52:44'),
(49, NULL, '8^^BASIN WASTE 0034L', '6', '1290', '1610', 'active', '[\"PRD-0049\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:53:58', '2026-10-11 08:53:58'),
(50, NULL, 'LIVER PILAR COCK 6129OL', '10', '1356', '1695', 'active', '[\"PRD-0050\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:55:38', '2026-10-11 08:55:38'),
(51, NULL, 'MOVING SINK COCK 6088OL', '6', '2310', '2885', 'active', '[\"PRD-0051\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:56:50', '2026-10-11 08:56:50'),
(52, NULL, '24^^TOWEL RAIL 0035', '11', '813', '1015', 'active', '[\"PRD-0052\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:57:51', '2026-10-11 08:57:51'),
(53, NULL, 'BASIN WASTE 0036', '20', '473', '590', 'active', '[\"PRD-0053\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:58:40', '2026-10-11 08:58:40'),
(54, NULL, 'BIB COCK STAR 0127S', '12', '1290', '1610', 'active', '[\"PRD-0054\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 08:59:31', '2026-10-11 08:59:31'),
(55, NULL, 'ANGLE STOP COCK ECO 1024', '17', '610', '760', 'active', '[\"PRD-0055\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 09:00:37', '2026-10-11 09:00:37'),
(56, NULL, 'MOVING PILLAR COCK 6089OL', '6', '2310', '2885', 'active', '[\"PRD-0056\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 09:01:35', '2026-10-11 09:01:35'),
(57, NULL, '20/16 HANDMADE SINK HKS202', '2', '3740', '4670', 'active', '[\"PRD-0057\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 09:03:34', '2026-10-11 09:03:34'),
(58, NULL, '24/18 HAND MADE SINK HKS205', '2', '4420', '5520', 'active', '[\"PRD-0058\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-11 09:04:34', '2026-10-11 09:04:34'),
(59, NULL, '4HF10', '0', '61.5', '66', 'active', '[\"PRD-0059\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-11 09:20:19', '2026-10-11 09:20:19'),
(60, NULL, '4HG23', '0', '66.3', '72', 'active', '[\"PRD-0060\"]', 3, 4, NULL, '16\"x16\"', '16', '09', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 09:22:24', '2026-10-11 09:22:24'),
(61, NULL, '4HG53', '0', '66.3', '72', 'active', '[\"PRD-0061\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 09:26:09', '2026-10-11 09:26:09'),
(62, NULL, '4HG51', '0', '66.3', '72', 'active', '[\"PRD-0062\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 12:01:10', '2026-10-11 12:01:10'),
(63, NULL, '4HG54', '57', '1060.8', '1152', 'active', '[\"PRD-0063\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 12:02:24', '2026-10-11 12:02:24'),
(64, NULL, '4HG36', '0', '1061', '1152', 'active', '[\"PRD-0064\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 12:04:18', '2026-10-11 12:04:18'),
(65, NULL, '4HG40', '0', '1061', '1152', 'active', '[\"PRD-0065\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 12:05:51', '2026-10-11 12:05:51'),
(66, NULL, '4HG45', '0', '1061', '1152', 'active', '[\"PRD-0066\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 12:06:57', '2026-10-11 12:06:57'),
(67, NULL, '4HG25', '0', '1061', '1152', 'active', '[\"PRD-0067\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 12:08:14', '2026-10-11 12:08:14'),
(68, NULL, '4HG38', '0', '1061', '1152', 'active', '[\"PRD-0068\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-11 12:09:57', '2026-10-11 12:09:57'),
(69, NULL, '4HG44', '0', '1061', '1152', 'active', '[\"PRD-0069\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 02:33:31', '2026-10-12 02:33:31'),
(70, NULL, '4HG02', '0', '1061', '1152', 'active', '[\"PRD-0070\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 02:34:31', '2026-10-12 02:34:31'),
(71, NULL, '4HF12', '0', '984', '1072', 'active', '[\"PRD-0071\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:03:46', '2026-10-12 04:03:46'),
(72, NULL, '4HF13', '0', '984', '1072', 'active', '[\"PRD-0072\"]', 3, 4, NULL, '16\"x16\"', '16', '8', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:04:33', '2026-10-12 04:04:33'),
(73, NULL, '4DP13', '0', '1031', '1152', 'active', '[\"PRD-0073\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:05:40', '2026-10-12 04:05:40'),
(74, NULL, '4DP11', '0', '1031', '1152', 'active', '[\"PRD-0074\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:06:57', '2026-10-12 04:06:57'),
(75, NULL, '4HG19', '0', '1061', '1152', 'active', '[\"PRD-0075\"]', 3, 4, NULL, '16\"x16\"', '16', '9', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:08:33', '2026-10-12 04:08:33'),
(76, NULL, '3HF10', '0', '831', '896', 'active', '[\"PRD-0076\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:09:52', '2026-10-12 04:09:52'),
(77, NULL, '3HF12', '0', '831', '912', 'active', '[\"PRD-0077\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:10:37', '2026-10-12 04:10:37'),
(78, NULL, '3HF13', '0', '831', '912', 'active', '[\"PRD-0078\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:11:22', '2026-10-12 04:11:22'),
(79, NULL, '3HF10STP', '0', '876', '992', 'active', '[\"PRD-0079\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:12:20', '2026-10-12 04:12:20'),
(80, NULL, '2HF10STP', '0', '766', '960', 'active', '[\"PRD-0080\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:13:13', '2026-10-12 04:13:13'),
(81, NULL, '2HF12STP', '0', '767', '992', 'active', '[\"PRD-0081\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Full Body', NULL, 2, 1, '2026-10-12 04:14:01', '2026-10-12 04:14:01'),
(82, NULL, '3DP5019', '0', '861', '1008', 'active', '[\"PRD-0082\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:16:11', '2026-10-12 04:16:11'),
(83, NULL, '3DP6043', '0', '861', '1008', 'active', '[\"PRD-0083\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:17:06', '2026-10-12 04:17:06'),
(84, NULL, '3DP6012', '0', '861', '1008', 'active', '[\"PRD-0084\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:17:54', '2026-10-12 04:17:54'),
(85, NULL, '3DP6013', '0', '861', '1008', 'active', '[\"PRD-0085\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:18:35', '2026-10-12 04:18:35'),
(86, NULL, '3DP5011BK', '0', '861', '1008', 'active', '[\"PRD-0086\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:19:31', '2026-10-12 04:19:31'),
(87, NULL, '3DP5010', '0', '861', '1008', 'active', '[\"PRD-0087\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:20:41', '2026-10-12 04:20:41'),
(88, NULL, '3DP6031P', '0', '861', '1008', 'active', '[\"PRD-0088\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:21:38', '2026-10-12 04:21:38'),
(89, NULL, '3DP6036P', '0', '861', '1008', 'active', '[\"PRD-0089\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:22:43', '2026-10-12 04:22:43'),
(90, NULL, '3DP5015P', '0', '861', '1008', 'active', '[\"PRD-0090\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:23:57', '2026-10-12 04:23:57'),
(91, NULL, '3DP6004P', '0', '861', '1008', 'active', '[\"PRD-0091\"]', 3, 4, NULL, '12\"x12\"', '16', '16', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 04:24:47', '2026-10-12 04:24:47'),
(92, NULL, '6004PGY', '0', '1154', '1248', 'active', '[\"PRD-0092\"]', 4, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:26:10', '2026-10-12 04:26:10'),
(93, NULL, 'W600401', '0', '1154', '1248', 'active', '[\"PRD-0093\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:27:33', '2026-10-12 04:27:33'),
(94, NULL, '6013DBR', '0', '1154', '1248', 'active', '[\"PRD-0094\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:28:58', '2026-10-12 04:28:58'),
(95, NULL, '6013LBR', '0', '1154', '1248', 'active', '[\"PRD-0095\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:29:39', '2026-10-12 04:29:39'),
(96, NULL, 'W601301', '0', '1154', '1248', 'active', '[\"PRD-0096\"]', 3, 4, NULL, '12\"x24\"', '16', '8', NULL, 'Glossy', NULL, 2, 1, '2026-10-12 04:30:18', '2026-10-12 04:30:18'),
(97, NULL, '6012DGR', '0', '1154', '1248', 'active', '[\"PRD-0097\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', NULL, NULL, 2, 1, '2026-10-12 04:30:56', '2026-10-12 04:30:56'),
(98, NULL, '6012LGR', '0', '1154', '1248', 'active', '[\"PRD-0098\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:31:22', '2026-10-12 04:31:22'),
(99, NULL, 'W601201', '0', '1154', '1248', 'active', '[\"PRD-0099\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:31:50', '2026-10-12 04:31:50'),
(100, NULL, '6007DBR', '0', '1154', '1248', 'active', '[\"PRD-0100\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:32:32', '2026-10-12 04:32:32'),
(101, NULL, '6007LBR', '0', '1154', '1248', 'active', '[\"PRD-0101\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:33:11', '2026-10-12 04:33:11'),
(102, NULL, 'W600701', '0', '1154', '1248', 'active', '[\"PRD-0102\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:33:45', '2026-10-12 04:33:45'),
(103, NULL, 'W600702', '0', '1154', '1248', 'active', '[\"PRD-0103\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:34:58', '2026-10-12 04:34:58'),
(104, NULL, '6031DBR', '0', '1154', '1248', 'active', '[\"PRD-0104\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:35:53', '2026-10-12 04:35:53'),
(105, NULL, '6031LBR', '0', '1154', '1248', 'active', '[\"PRD-0105\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', NULL, NULL, 2, 1, '2026-10-12 04:37:03', '2026-10-12 04:37:03'),
(106, NULL, 'W603101', '0', '1154', '1248', 'active', '[\"PRD-0106\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:37:44', '2026-10-12 04:37:44'),
(107, NULL, 'W603102', '0', '1154', '1248', 'active', '[\"PRD-0107\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:38:20', '2026-10-12 04:38:20'),
(108, NULL, '6032DBE', '0', '1154', '1248', 'active', '[\"PRD-0108\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:39:08', '2026-10-12 04:39:08'),
(109, NULL, '6032LBE', '0', '1154', '1248', 'active', '[\"PRD-0109\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:39:46', '2026-10-12 04:39:46'),
(110, NULL, 'W603201', '0', '1154', '1248', 'active', '[\"PRD-0110\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:48:03', '2026-10-12 04:48:03'),
(111, NULL, 'W603202', '0', '1154', '1248', 'active', '[\"PRD-0111\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:49:29', '2026-10-12 04:49:29'),
(112, NULL, '6037GY', '0', '1154', '1248', 'active', '[\"PRD-0112\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:50:45', '2026-10-12 04:50:45'),
(113, NULL, 'W603701', '0', '1154', '1248', 'active', '[\"PRD-0113\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:51:17', '2026-10-12 04:51:17'),
(114, NULL, '6036DTL', '0', '1154', '1248', 'active', '[\"PRD-0114\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:51:54', '2026-10-12 04:51:54'),
(115, NULL, '6036LTL', '0', '1154', '1248', 'active', '[\"PRD-0115\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:52:25', '2026-10-12 04:52:25'),
(116, NULL, 'W603601', '0', '1154', '1248', 'active', '[\"PRD-0116\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:52:58', '2026-10-12 04:52:58'),
(117, NULL, '6038DBR', '0', '1154', '1248', 'active', '[\"PRD-0117\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:53:47', '2026-10-12 04:53:47'),
(118, NULL, '6038LBR', '0', '1154', '1248', 'active', '[\"PRD-0118\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:54:16', '2026-10-12 04:54:16'),
(119, NULL, 'W603801', '0', '1154', '1248', 'active', '[\"PRD-0119\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:55:02', '2026-10-12 04:55:02'),
(120, NULL, 'W603802', '0', '1154', '1248', 'active', '[\"PRD-0120\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:55:55', '2026-10-12 04:55:55'),
(121, NULL, '6049DGY', '0', '1154', '1248', 'active', '[\"PRD-0121\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:57:24', '2026-10-12 04:57:24'),
(122, NULL, '6049LGY', '0', '1154', '1248', 'active', '[\"PRD-0122\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:57:52', '2026-10-12 04:57:52'),
(123, NULL, 'W604901', '0', '1154', '1248', 'active', '[\"PRD-0123\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 04:58:45', '2026-10-12 04:58:45'),
(124, NULL, '6005DBR', '0', '1124', '1248', 'active', '[\"PRD-0124\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:00:31', '2026-10-12 05:00:31'),
(125, NULL, '6005LBR', '0', '1124', '1248', 'active', '[\"PRD-0125\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:01:01', '2026-10-12 05:01:01'),
(126, NULL, 'W600501', '0', '1124', '1248', 'active', '[\"PRD-0126\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:01:51', '2026-10-12 05:01:51'),
(127, NULL, 'W600502', '0', '1124', '1248', 'active', '[\"PRD-0127\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:02:16', '2026-10-12 05:02:16'),
(128, NULL, '6011GY', '0', '1124', '1248', 'active', '[\"PRD-0128\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:03:31', '2026-10-12 05:03:31'),
(129, NULL, 'W601101', '0', '1124', '1248', 'active', '[\"PRD-0129\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:04:20', '2026-10-12 05:04:20'),
(130, NULL, '6034WH', '0', '1124', '1248', 'active', '[\"PRD-0130\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:05:00', '2026-10-12 05:05:00'),
(131, NULL, 'W603401', '0', '1124', '1248', 'active', '[\"PRD-0131\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:05:35', '2026-10-12 05:05:35'),
(132, NULL, '6040DGY', '0', '1124', '1248', 'active', '[\"PRD-0132\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:06:32', '2026-10-12 05:06:32'),
(133, NULL, '6040LGY', '0', '1124', '1248', 'active', '[\"PRD-0133\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Glossy', NULL, 2, 1, '2026-10-12 05:07:09', '2026-10-12 05:07:09'),
(134, NULL, 'W604001', '0', '1124', '1248', 'active', '[\"PRD-0134\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', NULL, NULL, 2, 1, '2026-10-12 05:07:45', '2026-10-12 05:07:45'),
(135, NULL, '6043DGR', '0', '1124', '1248', 'active', '[\"PRD-0135\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 05:08:36', '2026-10-12 05:08:36'),
(136, NULL, '6043LGR', '0', '1124', '1248', 'active', '[\"PRD-0136\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 05:09:04', '2026-10-12 05:09:04'),
(137, NULL, 'W604301', '0', '1124', '1248', 'active', '[\"PRD-0137\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 05:09:35', '2026-10-12 05:09:35'),
(138, NULL, '6051DGY', '0', '1124', '1248', 'active', '[\"PRD-0138\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 05:52:54', '2026-10-12 05:52:54'),
(139, NULL, '6051LGY', '0', '1124', '1248', 'active', '[\"PRD-0139\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 05:53:22', '2026-10-12 05:53:22'),
(140, NULL, 'W605101', '0', '1124', '1248', 'active', '[\"PRD-0140\"]', 3, 4, NULL, '12\"x24\"', '16', '8', 'Grade A', 'Matt', NULL, 2, 1, '2026-10-12 05:54:03', '2026-10-12 05:54:03'),
(141, NULL, '3/4 CONCEAL STOP COCK1022S', '48', '1425', '1780', 'active', '[\"PRD-0141\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:28:40', '2026-10-12 10:28:40'),
(142, NULL, '1 CONCEAL STOP COCK1023S', '33', '1493', '1850', 'active', '[\"PRD-0142\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:31:55', '2026-10-12 10:31:55'),
(143, NULL, 'SQUARE MOVING SHOWERJ08', '5', '1221', '1520', 'active', '[\"PRD-0143\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:35:30', '2026-10-12 10:35:30'),
(144, NULL, 'CONCEAL BIB COCK0128', '1', '1290', '1610', 'active', '[\"PRD-0144\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:37:39', '2026-10-12 10:37:39'),
(145, NULL, 'CONCEAL BIB COCK LIVER6128', '8', '1290', '1610', 'active', '[\"PRD-0145\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:42:59', '2026-10-12 10:42:59'),
(146, NULL, 'CONCEAL BIB COCK 6128', '6', '1290', '1610', 'active', '[\"PRD-0146\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:46:38', '2026-10-12 10:46:38'),
(147, NULL, 'MOVING PILLER COCK STAR0018', '6', '2380', '2970', 'active', '[\"PRD-0147\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:50:28', '2026-10-12 10:50:28'),
(148, NULL, 'MOVING PIILER COCK LIVER DELTA6018', '2', '2380', '2970', 'active', '[\"PRD-0148\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:52:46', '2026-10-12 10:52:46'),
(149, NULL, 'MOVING SINK COCK LIVER DELTA6013', '2', '2380', '2970', 'active', '[\"PRD-0149\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:54:05', '2026-10-12 10:54:05'),
(150, NULL, 'MOVING SINK COCK STAR0013', '2', '2380', '2970', 'active', '[\"PRD-0150\"]', 6, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:55:04', '2026-10-12 10:55:04'),
(151, NULL, 'MEDIUM BASIN MIXER HOT & COLD', '10', '3775', '4440', 'active', '[\"PRD-0151\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 10:59:33', '2026-10-12 10:59:33'),
(152, NULL, 'RAIN SHOWERR SQUARE SS10^^', '4', '2590', '3040', 'active', '[\"PRD-0152\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:02:13', '2026-10-12 11:02:13'),
(153, NULL, 'SQUARE RAIN SHOWER 8^^', '14', '1360', '1590', 'active', '[\"PRD-0153\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:04:41', '2026-10-12 11:04:41'),
(154, NULL, 'RAIN SHOWER ROUND SS 8^^', '10', '1775', '2080', 'active', '[\"PRD-0154\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:07:09', '2026-10-12 11:07:09'),
(155, NULL, 'RAIN SHOWER SQUARE SS8^^', '4', '1775', '2080', 'active', '[\"PRD-0155\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:08:42', '2026-10-12 11:08:42'),
(156, NULL, 'RAIN SHOWER SQUARE SS6^^', '7', '1590', '1860', 'active', '[\"PRD-0156\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:11:01', '2026-10-12 11:11:01'),
(157, NULL, 'RAIN SHOWER 6^^WALL MOUNT', '8', '1330', '1570', 'active', '[\"PRD-0157\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:12:55', '2026-10-12 11:12:55'),
(158, NULL, 'ANGLE STOP VALVE SQUARE', '26', '633', '790', 'active', '[\"PRD-0158\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:19:05', '2026-10-12 11:19:05'),
(159, NULL, 'ANGLE STOP VALVE OVAL', '21', '633', '790', 'active', '[\"PRD-0159\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:20:35', '2026-10-12 11:20:35'),
(160, NULL, 'CONCEAL BIB COCK STAR ASTRA', '20', '1402', '1650', 'active', '[\"PRD-0160\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:25:54', '2026-10-12 11:25:54'),
(161, NULL, 'CONCEAL BIB COCK ALENA', '30', '1340', '1575', 'active', '[\"PRD-0161\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:34:03', '2026-10-12 11:34:03'),
(162, NULL, 'BASIN PILLER COCK ALENA', '11', '1690', '2100', 'active', '[\"PRD-0162\"]', 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-12 11:36:49', '2026-10-12 11:36:49');

-- --------------------------------------------------------

--
-- Table structure for table `product_returns`
--

CREATE TABLE `product_returns` (
  `id` bigint UNSIGNED NOT NULL,
  `amount` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_amount` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `due_amount` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED DEFAULT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referance_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_payable_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `grand_subtotal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `return_adjustment_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `attach_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplier_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_details`
--

CREATE TABLE `purchase_order_details` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `purchase_id` bigint UNSIGNED NOT NULL,
  `quantity` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost_price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_payment_details`
--

CREATE TABLE `purchase_payment_details` (
  `id` bigint UNSIGNED NOT NULL,
  `purchases_id` bigint UNSIGNED NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_due_collection_date` date DEFAULT NULL,
  `purchase_order_details_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_returns`
--

CREATE TABLE `purchase_returns` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_id` bigint UNSIGNED NOT NULL,
  `supplier_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `due_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `quantity` int NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `sub_category_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint UNSIGNED NOT NULL,
  `supplier_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_payable_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_due_collections`
--

CREATE TABLE `supplier_due_collections` (
  `id` bigint UNSIGNED NOT NULL,
  `paid_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_payable_amount` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_collection_date` date DEFAULT NULL,
  `supplier_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thanas`
--

CREATE TABLE `thanas` (
  `id` bigint UNSIGNED NOT NULL,
  `Thana_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_id` bigint UNSIGNED NOT NULL,
  `upazila_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint UNSIGNED NOT NULL,
  `unit_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `unit_name`, `status`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Pcs', 'active', 1, '2026-10-11 04:53:37', '2026-10-11 04:53:37'),
(2, 'Box', 'active', 1, '2026-10-11 06:06:25', '2026-10-11 06:06:25');

-- --------------------------------------------------------

--
-- Table structure for table `upazilas`
--

CREATE TABLE `upazilas` (
  `id` bigint UNSIGNED NOT NULL,
  `upazila_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','approved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'users',
  `permissions` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `img_url`, `name`, `email`, `mobile`, `password`, `otp`, `otp_expires_at`, `status`, `role`, `permissions`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Admin', 'admin@gmail.com', '01975-703216', '$2b$10$pwJYWrl.MnZUAuzq4BCpAekmfrjtU4nWpmDHMgDbABjDz9439zvAS', '000000', NULL, 'approved', 'admin', '{\"pos\":true,\"products\":true,\"purchases\":true,\"invoices\":true,\"customers\":true,\"suppliers\":true,\"expenses\":true,\"reports\":true,\"users\":true}', '2026-10-11 04:53:37', '2026-10-11 04:53:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brands_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_user_id_foreign` (`user_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_district_id_foreign` (`district_id`),
  ADD KEY `customers_location_id_foreign` (`location_id`),
  ADD KEY `customers_thana_id_foreign` (`thana_id`),
  ADD KEY `customers_upazila_id_foreign` (`upazila_id`),
  ADD KEY `customers_user_id_foreign` (`user_id`);

--
-- Indexes for table `customer_payment_details`
--
ALTER TABLE `customer_payment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_payment_details_customer_id_foreign` (`customer_id`),
  ADD KEY `customer_payment_details_user_id_foreign` (`user_id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `districts_user_id_foreign` (`user_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_expense_type_id_foreign` (`expense_type_id`),
  ADD KEY `expenses_staff_id_foreign` (`staff_id`),
  ADD KEY `expenses_user_id_foreign` (`user_id`);

--
-- Indexes for table `expense_types`
--
ALTER TABLE `expense_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_types_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `locations_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `opening_balances`
--
ALTER TABLE `opening_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `opening_balances_date_user_id_unique` (`date`,`user_id`),
  ADD KEY `opening_balances_user_id_foreign` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_customer_id_foreign` (`customer_id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_details_order_id_foreign` (`order_id`),
  ADD KEY `order_details_product_id_foreign` (`product_id`),
  ADD KEY `order_details_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_payment_details`
--
ALTER TABLE `order_payment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_payment_details_order_id_foreign` (`order_id`),
  ADD KEY `order_payment_details_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`),
  ADD KEY `products_category_id_foreign` (`category_id`),
  ADD KEY `products_sub_category_id_foreign` (`sub_category_id`),
  ADD KEY `products_unit_id_foreign` (`unit_id`),
  ADD KEY `products_user_id_foreign` (`user_id`);

--
-- Indexes for table `product_returns`
--
ALTER TABLE `product_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_returns_customer_id_foreign` (`customer_id`),
  ADD KEY `product_returns_order_id_foreign` (`order_id`),
  ADD KEY `product_returns_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchases_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchases_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchase_order_details`
--
ALTER TABLE `purchase_order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_details_product_id_foreign` (`product_id`),
  ADD KEY `purchase_order_details_purchase_id_foreign` (`purchase_id`),
  ADD KEY `purchase_order_details_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchase_payment_details`
--
ALTER TABLE `purchase_payment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_payment_details_purchase_order_details_id_foreign` (`purchase_order_details_id`),
  ADD KEY `purchase_payment_details_purchases_id_foreign` (`purchases_id`),
  ADD KEY `purchase_payment_details_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_returns_product_id_foreign` (`product_id`),
  ADD KEY `purchase_returns_purchase_id_foreign` (`purchase_id`),
  ADD KEY `purchase_returns_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchase_returns_user_id_foreign` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`),
  ADD KEY `sessions_user_id_index` (`user_id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_categories_category_id_foreign` (`category_id`),
  ADD KEY `sub_categories_user_id_foreign` (`user_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `suppliers_user_id_foreign` (`user_id`);

--
-- Indexes for table `supplier_due_collections`
--
ALTER TABLE `supplier_due_collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_due_collections_supplier_id_foreign` (`supplier_id`),
  ADD KEY `supplier_due_collections_user_id_foreign` (`user_id`);

--
-- Indexes for table `thanas`
--
ALTER TABLE `thanas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thanas_district_id_foreign` (`district_id`),
  ADD KEY `thanas_upazila_id_foreign` (`upazila_id`),
  ADD KEY `thanas_user_id_foreign` (`user_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `units_user_id_foreign` (`user_id`);

--
-- Indexes for table `upazilas`
--
ALTER TABLE `upazilas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `upazilas_district_id_foreign` (`district_id`),
  ADD KEY `upazilas_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer_payment_details`
--
ALTER TABLE `customer_payment_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_types`
--
ALTER TABLE `expense_types`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `opening_balances`
--
ALTER TABLE `opening_balances`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_payment_details`
--
ALTER TABLE `order_payment_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- AUTO_INCREMENT for table `product_returns`
--
ALTER TABLE `product_returns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_order_details`
--
ALTER TABLE `purchase_order_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_payment_details`
--
ALTER TABLE `purchase_payment_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_due_collections`
--
ALTER TABLE `supplier_due_collections`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thanas`
--
ALTER TABLE `thanas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `upazilas`
--
ALTER TABLE `upazilas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `customers_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `customers_thana_id_foreign` FOREIGN KEY (`thana_id`) REFERENCES `thanas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `customers_upazila_id_foreign` FOREIGN KEY (`upazila_id`) REFERENCES `upazilas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `customer_payment_details`
--
ALTER TABLE `customer_payment_details`
  ADD CONSTRAINT `customer_payment_details_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `customer_payment_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_expense_type_id_foreign` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `expenses_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `expenses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `expense_types`
--
ALTER TABLE `expense_types`
  ADD CONSTRAINT `expense_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `locations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `opening_balances`
--
ALTER TABLE `opening_balances`
  ADD CONSTRAINT `opening_balances_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `order_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `order_payment_details`
--
ALTER TABLE `order_payment_details`
  ADD CONSTRAINT `order_payment_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `order_payment_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `products_sub_category_id_foreign` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `products_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `products_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `product_returns`
--
ALTER TABLE `product_returns`
  ADD CONSTRAINT `product_returns_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `product_returns_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `product_returns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `purchases_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `purchase_order_details`
--
ALTER TABLE `purchase_order_details`
  ADD CONSTRAINT `purchase_order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_details_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `purchase_payment_details`
--
ALTER TABLE `purchase_payment_details`
  ADD CONSTRAINT `purchase_payment_details_purchase_order_details_id_foreign` FOREIGN KEY (`purchase_order_details_id`) REFERENCES `purchase_order_details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_payment_details_purchases_id_foreign` FOREIGN KEY (`purchases_id`) REFERENCES `purchases` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_payment_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `purchase_returns`
--
ALTER TABLE `purchase_returns`
  ADD CONSTRAINT `purchase_returns_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_returns_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_returns_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_returns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `sub_categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `supplier_due_collections`
--
ALTER TABLE `supplier_due_collections`
  ADD CONSTRAINT `supplier_due_collections_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_due_collections_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `thanas`
--
ALTER TABLE `thanas`
  ADD CONSTRAINT `thanas_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `thanas_upazila_id_foreign` FOREIGN KEY (`upazila_id`) REFERENCES `upazilas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `thanas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `units_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `upazilas`
--
ALTER TABLE `upazilas`
  ADD CONSTRAINT `upazilas_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `upazilas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
