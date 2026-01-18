-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: attendance
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `admin_activity_log`
--

DROP TABLE IF EXISTS `admin_activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_activity_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `action` varchar(200) NOT NULL,
  `target_table` varchar(50) DEFAULT NULL,
  `target_record_id` int DEFAULT NULL,
  `description` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `admin_id` (`admin_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_activity_log`
--

LOCK TABLES `admin_activity_log` WRITE;
/*!40000 ALTER TABLE `admin_activity_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `check_in_time` datetime DEFAULT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `check_in_photo_url` varchar(255) DEFAULT NULL,
  `check_out_photo_url` varchar(255) DEFAULT NULL,
  `gps_latitude` double DEFAULT NULL,
  `gps_longitude` double DEFAULT NULL,
  `working_hours` decimal(5,2) DEFAULT '0.00',
  `overtime_hours` decimal(5,2) DEFAULT '0.00',
  `attendance_status` varchar(30) DEFAULT NULL,
  `face_verified` tinyint(1) DEFAULT '0',
  `location_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`attendance_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,1,'2025-12-13 12:09:43','2025-12-13 12:11:19',NULL,NULL,NULL,NULL,8.00,0.00,'Present',0,0),(2,1,'2025-12-13 12:11:14','2025-12-13 12:11:19',NULL,NULL,NULL,NULL,8.00,0.00,'Present',0,0),(3,1,'2025-12-13 14:59:35','2025-12-13 06:12:12',NULL,NULL,NULL,NULL,8.00,0.00,'Present',0,0),(4,2,'2025-12-15 10:31:01','2025-12-13 06:12:12',NULL,NULL,NULL,NULL,8.00,0.00,'Present',0,0),(5,5,'2025-12-15 10:30:02','2025-12-15 06:00:00',NULL,NULL,NULL,NULL,8.00,0.00,'Present',0,0),(6,7,'2025-12-16 11:28:01',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(7,9,'2025-12-16 11:34:51',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(8,6,'2025-12-16 11:35:23',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(9,3,'2025-12-16 11:35:42',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(10,12,'2025-12-17 10:17:20',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(11,10,'2025-12-17 10:18:08',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(12,2,'2025-12-17 10:18:56',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(13,5,'2025-12-17 10:23:01',NULL,NULL,NULL,NULL,NULL,0.00,0.00,NULL,0,0),(14,3,'2025-12-18 11:46:57','2025-12-18 11:47:02',NULL,NULL,NULL,NULL,0.00,0.00,'PRESENT',0,0),(15,2,'2025-12-18 11:48:45','2025-12-18 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'PRESENT',0,0),(16,4,'2025-12-18 12:18:38','2025-12-18 05:55:10',NULL,NULL,NULL,NULL,0.00,0.00,'PRESENT',0,0),(17,6,'2025-12-18 14:44:51','2025-12-18 05:55:10',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(18,2,'2025-12-19 10:55:36',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(19,3,'2025-12-19 11:17:15',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(20,9,'2025-12-19 11:32:29',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(21,12,'2025-12-19 11:39:23',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(22,6,'2025-12-19 11:54:35','2025-12-19 12:10:08',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(23,10,'2025-12-19 12:47:32',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(24,2,'2025-12-22 10:43:38','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(25,10,'2025-12-22 10:47:03','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(26,6,'2025-12-22 12:47:43','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(27,11,'2025-12-22 14:30:25','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(28,2,'2025-12-22 14:56:03','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(29,2,'2025-12-22 16:35:14','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(30,2,'2025-12-22 16:35:14','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(31,7,'2025-12-22 16:38:42','2025-12-22 06:00:12',NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(32,2,'2025-12-23 10:31:28',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(33,2,'2025-12-23 10:33:54',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(34,3,'2025-12-23 10:35:39',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(35,4,'2025-12-23 10:39:40',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(36,12,'2025-12-23 11:09:50',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(37,12,'2025-12-23 11:11:14',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(38,12,'2025-12-23 11:27:32',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(39,1,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(40,5,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(41,6,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(42,7,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(43,8,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(44,10,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(45,11,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(46,12,'2025-12-23 12:15:45',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(47,1,'2025-12-24 10:33:10',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(48,12,'2025-12-24 11:26:23',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(49,3,'2025-12-24 11:26:50',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(50,4,'2025-12-24 11:27:52',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(51,2,'2025-12-24 11:28:18',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(52,6,'2025-12-24 11:29:04',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(53,10,'2025-12-24 11:33:21',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(54,7,'2025-12-24 11:33:51',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(55,5,'2025-12-24 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(56,8,'2025-12-24 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(57,11,'2025-12-24 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(58,2,'2025-12-27 10:38:13','2025-12-27 11:47:05',NULL,NULL,NULL,NULL,0.00,0.00,'LATE',0,0),(59,1,'2025-12-27 11:37:23',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(60,12,'2025-12-27 11:51:51',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(61,2,'2025-12-29 11:25:13',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'HALF_DAY',0,0),(62,2,'2025-12-30 10:19:52',NULL,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNj',NULL,20.0040789,73.7776276,0.00,0.00,NULL,0,0),(63,1,'2025-12-30 10:36:19',NULL,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNj',NULL,20.0040766,73.7776362,0.00,0.00,NULL,0,0),(64,3,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(65,4,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(66,5,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(67,6,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(68,7,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(69,8,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(70,10,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(71,11,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(72,12,'2025-12-30 14:00:00',NULL,NULL,NULL,NULL,NULL,0.00,0.00,'ABSENT',0,0),(73,2,'2026-01-03 17:22:29',NULL,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNj',NULL,20.0025197,73.7778574,0.00,0.00,'HALF_DAY',0,0),(74,1,'2026-01-03 17:23:28',NULL,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNj',NULL,20.0025168,73.7778625,0.00,0.00,'HALF_DAY',0,0),(75,2,'2026-01-05 15:33:01',NULL,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNj',NULL,20.0023692,73.7780957,0.00,0.00,'HALF_DAY',0,0);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `work_location` varchar(100) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `employee_type` enum('office','field') NOT NULL,
  `shift_hours` int NOT NULL,
  `monthly_salary` decimal(10,2) NOT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `permanent_address` text,
  `face_embedding` text,
  `face_photo_url` varchar(255) DEFAULT NULL,
  `face_registered` tinyint(1) DEFAULT '0',
  `office_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,2,'Namarata Gaikwad','Software Engineer','IT','9022883928','Nashik','2025-12-09','active','office',8,0.00,NULL,NULL,'[0.12,0.45,-0.22]',NULL,1,2,2),(2,3,'Pratiksha Gaikwad','Software Engineer','IT','8830866097','Nashik','2025-10-08','active','office',8,0.00,NULL,NULL,'[0.12,0.45,-0.22]',NULL,1,2,2),(3,6,'Gorakh Dongare','IT Head','IT',NULL,'Nashik','2025-12-15','active','office',0,0.00,NULL,NULL,NULL,NULL,0,2,2),(4,7,'Nilesh Dange','Accountant','Account','7588702587','Nashik','2025-12-15','active','office',0,0.00,NULL,NULL,NULL,NULL,0,1,1),(5,8,'Dnyaneshwar Sangale','Manager','HR','7020711037','Nashik','2025-12-15','active','office',0,0.00,NULL,NULL,NULL,NULL,0,1,1),(6,9,'Dhanshari  Labhade','Architecture','Architecture',NULL,'Nashik','2025-12-16','active','office',0,0.00,NULL,NULL,NULL,NULL,0,1,1),(7,12,'Punam Sonawane','Civil Engineer','Civil','8767987654','Nashik','0000-00-00','active','office',0,0.00,NULL,NULL,NULL,NULL,0,1,1),(8,13,'Rani Kaiche','Accountant','Account','8767987654','Nashik','0000-00-00','active','office',0,0.00,NULL,NULL,NULL,NULL,0,1,1),(9,15,'Neha Sharma','Senior Solar Supervisor','Solar','7588702587','Nashik','0000-00-00','','',8,0.00,NULL,NULL,NULL,NULL,0,1,1),(10,16,'Ajinkya Pathade','Head','Civil','7689098765','Nashik','2025-12-22','active','office',8,0.00,NULL,NULL,NULL,NULL,0,1,1),(11,17,'Mangesh Jadhav','B.A','Solar','7276868636','Nashik','0000-00-00','active','office',8,0.00,NULL,NULL,NULL,NULL,0,1,1),(12,5,'Sunil Gite','B.A','Solar','7689098765','Nashik',NULL,'active','office',8,0.00,NULL,NULL,NULL,NULL,0,1,1),(13,0,'',NULL,NULL,NULL,NULL,NULL,'active','office',0,0.00,NULL,NULL,NULL,NULL,0,0,NULL),(14,18,'Surbhi Palave','B.E[Civil]','Civil','7756972077','Nashik','0000-00-00','active','office',8,0.00,'A+','Nashik',NULL,NULL,0,NULL,NULL),(15,20,'Mahesh Godse','Accountant','Account','8329443324','Nashik','0000-00-00','active','office',8,0.00,'B+','Nashik',NULL,NULL,0,NULL,NULL),(16,21,'Dhanshari Sathe','Solar head','Solar','96577672085','Nashik','0000-00-00','active','office',8,0.00,'A+','Nashik',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_reference`
--

DROP TABLE IF EXISTS `employee_reference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_reference` (
  `reference_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text,
  `relation` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reference_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_reference`
--

LOCK TABLES `employee_reference` WRITE;
/*!40000 ALTER TABLE `employee_reference` DISABLE KEYS */;
INSERT INTO `employee_reference` VALUES (1,16,'abc','7689765643','Nashik','Father','2026-01-06 10:01:38'),(2,16,'xqz','9087657865','Nashik','Mother','2026-01-06 10:01:38');
/*!40000 ALTER TABLE `employee_reference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gps_location`
--

DROP TABLE IF EXISTS `gps_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gps_location` (
  `gps_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `distance_from_location` decimal(8,2) DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `check_type` enum('IN','OUT') DEFAULT NULL,
  `status` enum('VALID','OUT_OF_RANGE') DEFAULT 'VALID',
  PRIMARY KEY (`gps_id`),
  KEY `idx_gps_emp` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gps_location`
--

LOCK TABLES `gps_location` WRITE;
/*!40000 ALTER TABLE `gps_location` DISABLE KEYS */;
/*!40000 ALTER TABLE `gps_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_request`
--

DROP TABLE IF EXISTS `leave_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_request` (
  `leave_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `admin_comment` text,
  `applied_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`leave_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_request`
--

LOCK TABLES `leave_request` WRITE;
/*!40000 ALTER TABLE `leave_request` DISABLE KEYS */;
INSERT INTO `leave_request` VALUES (1,1,'','2025-12-19','2025-12-20','Health','APPROVED',NULL,'2025-12-18 15:50:10'),(2,3,'','2025-12-19','2025-12-20','Family function','APPROVED',NULL,'2025-12-19 11:15:32'),(3,9,'','2025-12-19','2025-12-22','Family Function','REJECTED',NULL,'2025-12-19 11:33:00'),(4,12,'','2025-12-20','2025-12-22','Personal work','PENDING',NULL,'2025-12-19 11:39:40'),(5,3,'','2025-12-19','2025-12-20','Health issue','APPROVED',NULL,'2025-12-19 11:54:51'),(6,7,'','2025-12-24','2025-12-25','Personal work','APPROVED',NULL,'2025-12-24 15:26:45');
/*!40000 ALTER TABLE `leave_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `location`;
CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` enum('OFFICE','PLANT') DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `radius_meters` int DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`location_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
-- Dumping data for table `locations`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Lakshmi Clave','OFFICE',20.00404400,73.77762400,150,'active'),(2,'Bhaskar Adroit','OFFICE',20.00335500,73.77733800,150,'active');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office`
--

DROP TABLE IF EXISTS `office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office` (
  `office_id` int NOT NULL AUTO_INCREMENT,
  `office_name` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `radius_meters` int DEFAULT NULL,
  PRIMARY KEY (`office_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office`
--

LOCK TABLES `office` WRITE;
/*!40000 ALTER TABLE `office` DISABLE KEYS */;
INSERT INTO `office` VALUES (1,'Lakshmi Clave',20.0040802,73.7776342,100),(2,'Bhaskar Adroit',20.0029646,73.7772753,100);
/*!40000 ALTER TABLE `office` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_approval`
--

DROP TABLE IF EXISTS `salary_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_approval` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `month` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('APPROVED','PAID') DEFAULT 'APPROVED',
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`,`month`,`year`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_approval`
--

LOCK TABLES `salary_approval` WRITE;
/*!40000 ALTER TABLE `salary_approval` DISABLE KEYS */;
/*!40000 ALTER TABLE `salary_approval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','employee') NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `location_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'pratiksha','pratiksha@localhost.com','8790876545','$2b$10$ay0JOS7.bwsErdDVOo2KVufWRNYJJjYCzwDpYzdNkEHhP.bR9NeBK','admin','',NULL),(2,'Namarata Gaikwad','employee1@gmail.com','9595956780','$2b$10$DKO3lrw9/CpTYzs5Xz7qdOefgrV2XNTLTlqdesqdT.mPWyV9P4Sb6','employee','active',NULL),(3,'Pratiksha Gaikwad','rrypratikshagaikwad@gmail.com','8830866097','$2b$10$SR8Bc5tmq7xRZ1pvHRPZOuUu7uI5ges2o9EFdRnEPB8ZFIlA/RfDi','employee','active',NULL),(4,'Namrata ','rrynamarata@gmail.com',NULL,'$2b$10$Qxcj2Paac281B8AZ0qFed.yxZ0EJGs7PfW.fUf930oBbBjZMdF.6e','employee','active',NULL),(5,'Sunil Gite','rrysunilgite@gmail.com',NULL,'$2b$10$0C26Q.4NnLcJzqRglK1VpO3w5tUVAjShs8WBtFCA.QEXcN9mqfwW6','employee','active',NULL),(6,'Gorakh Dongare','rrygorakhdongare@gmail.com',NULL,'$2b$10$bfAuf7mAvM2wUEcQbn8p6.D8vDTbGE9S3V/QczDAGnaIXp0JVpEHW','employee','active',NULL),(7,'Nilesh Dange','rrynileshdange@localhost.com',NULL,'$2b$10$uq.8MEBdf1DGm/biOhisv.OJr2ViY6cZRwR36Wo3KSCBE0ydI6M5S','employee','active',NULL),(8,'Dnyaneshwar Sangale','rrydyneshwarsangale@gmail.com',NULL,'$2b$10$rLNFNwYXoI3syF78sOh.R..Frisv3N7hL/VFmmqP3AvsXYHYY5ClK','employee','active',NULL),(9,'Dhanshari  Labhade','rrydhanashari@gmail.com',NULL,'$2b$10$EMSXZCd8nfnNsndX8Bj8ee8SzhPXLjHbI2GqyHrzjEapddu4KkGEy','employee','active',NULL),(10,'Rani Kaiche','rryranikaiche@gmail.com',NULL,'$2b$10$4KnwbBfcF5izNH3Q1vKGi.3FSRm9Qnm9GNNW8Jszg.WWNVEC5DHGm','employee','active',NULL),(11,'Kasturi Salunke','rrykasturisalunke@gmail.com','8669570859','f9A3kP7ZQm2X_123','employee','active',NULL),(12,'Punam Sonawane','rrypunam@gmail.com','8767987654','$2b$10$4osgLtPe3.dbLvbpOvPL/ux.YTMgIFtTmccm9/kQeRKxtwGxOXwJO','employee','inactive',NULL),(13,'Rani Kaiche','ranikaiche@gmail.com','8767987654','$2b$10$rZ58WPqxoVOjFRTYecISGuySa4Qi9gPE77cfOwulb9mQAQyOniwb6','employee','active',NULL),(15,'Neha Sharma','neha@gmail.com','7588702587','$2b$10$FWbBkIlc1Gy1LYurvMVTPOVPHxkjn8QAs6I5ffOs.q8Om4IMFhY6q','employee','active',NULL),(16,'Ajinkya Pathade','rryajinkya@gmail.com','7689098765','$2b$10$epUH664XBlQ0LCEIA9CptO4UhZ4FeSUDkcfdq00tRC30Y1yLBuqxm','employee','active',NULL),(17,'Mangesh Jadhav','rrymangeshjadhav@gmail.com','7276868636','$2b$10$skqpk0ZcwYA5pLJRpjRb6umvPVdzkK39b61nH30MIMF4dbo6Mm/jC','employee','active',NULL),(18,'Surbhi Palave','rrysurbhi@gmail.com','7756972077','$2b$10$OfBVQejLnrxceKKOFNd4mecgxen/aGlqRvfTz5M6GddVTclDJ5Q0y','employee','active',NULL),(19,'Mahesh Godse','rrymaheshgodse@gmail.com','8329443324','$2b$10$j7yWM396.vQklVMgBm0qKOhefgN5BKk1Olr4kUze5iv43sO9mEin.','employee','active',NULL),(20,'Mahesh Godse','rrymahesh@gmail.com','8329443324','$2b$10$a3SGEKslYFcUuHdE9hAaS.MG99sG13EaCURDAPzrhJlOk7TSCElzq','employee','active',NULL),(21,'Dhanshari Sathe','rrydhansharisathe@gmail.com','96577672085','$2b$10$FUhglEIRpzq5ZU5B3NmQNuwjSTvioVjj6m8.a8SZFpRchW55T7sge','employee','active',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-07 12:35:52

/*17-01-26*/
CREATE TABLE department (
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE
);
INSERT INTO department (name)
VALUES
('Solar'), ('Account'), ('IT'), ('RMC Head'),
('RMC'), ('Collection'), ('Office'),
('Purchase'), ('Design Studio'),
('QA/QC'), ('Infra'), ('Vehicle');

CREATE TABLE department_location (
  id INT PRIMARY KEY AUTO_INCREMENT,
  department_id INT,
  location_id INT,
  FOREIGN KEY (department_id) REFERENCES department(department_id),
  FOREIGN KEY (location_id) REFERENCES location(location_id)
);

ALTER TABLE employee
ADD department_id INT,
ADD FOREIGN KEY (department_id)
REFERENCES department(department_id);

ALTER TABLE department
ADD COLUMN is_roaming TINYINT(1) DEFAULT 0;

ALTER TABLE attendance
ADD COLUMN location_id INT;

CREATE TABLE shift (
  shift_id INT PRIMARY KEY AUTO_INCREMENT,
  shift_name VARCHAR(50),          -- General / Driver / Night
  start_time TIME,                 -- 08:00:00
  end_time TIME,                   -- 17:00:00 or 20:00:00
  full_day_hours DECIMAL(5,2),      -- 8.00 / 12.00
  half_day_hours DECIMAL(5,2),      -- 4.00 / 6.00
  ot_allowed TINYINT(1) DEFAULT 0,  -- 1 = yes
  max_ot_hours DECIMAL(5,2) DEFAULT 0
);
ALTER TABLE employee
ADD shift_id INT,
ADD FOREIGN KEY (shift_id) REFERENCES shift(shift_id);
