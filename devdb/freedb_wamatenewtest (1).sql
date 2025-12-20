-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: sql.freedb.tech
-- Generation Time: Dec 20, 2025 at 05:53 AM
-- Server version: 8.0.44-0ubuntu0.22.04.1
-- PHP Version: 8.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `freedb_wamatenewtest`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `jid` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `push_name` varchar(255) DEFAULT NULL,
  `profile_pic` text,
  `is_group` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `instance_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `assigned_seat_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `jid`, `name`, `push_name`, `profile_pic`, `is_group`, `createdAt`, `updatedAt`, `instance_id`, `assigned_seat_id`, `user_id`) VALUES
('012f57ab-353b-414c-8bc6-fc15f3bac24a', '222230231404721@lid', 'Abdo ⚡️', 'Abdo ⚡️', NULL, 0, '2025-12-19 14:45:18', '2025-12-19 14:45:18', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('05278504-f580-4f38-997a-474558902775', '201001742924@s.whatsapp.net', '201001742924', NULL, NULL, 0, '2025-12-18 23:33:53', '2025-12-18 23:33:53', NULL, NULL, NULL),
('078b1aae-4277-4d00-a41b-3820613836d9', '9900503609415@lid', 'HDHPS', 'HDHPS', NULL, 0, '2025-12-19 13:26:57', '2025-12-19 13:26:57', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('0bc6bd2c-b0d7-4fa2-98fe-c4f6798ef119', '119434618380351@lid', 'intense perfumes house', 'intense perfumes house', NULL, 0, '2025-12-18 10:08:12', '2025-12-18 10:08:12', NULL, NULL, NULL),
('0c080140-243b-4524-a6d8-2667a30dc4d2', '195253642522659@lid', 'Wahyu WB', 'Wahyu WB', NULL, 0, '2025-12-19 13:19:03', '2025-12-19 13:19:03', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('2277bdfd-b003-4f1e-a01b-831ee14d6b5c', '19010045358154@lid', 'Asir Hossain', 'Asir Hossain', NULL, 0, '2025-12-19 13:19:18', '2025-12-19 13:19:18', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('2ab38789-45d2-4849-9786-57d0e6afca61', '229170982420646@lid', 'Mohamed Abuelela', 'Mohamed Abuelela', NULL, 0, '2025-12-18 11:09:08', '2025-12-18 11:09:13', NULL, NULL, NULL),
('2ba9122c-94de-4ad6-b188-f5316254445e', '201001742924@s.whatsapp.net', '201001742924', NULL, NULL, 0, '2025-12-19 00:53:57', '2025-12-20 04:40:24', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('36fc480d-d785-4d69-ad33-353dd83b243c', '209787845398651@lid', 'Marketing', 'Marketing', NULL, 0, '2025-12-20 04:43:17', '2025-12-20 05:14:47', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('3a968f58-53b0-4e3a-a053-54ecdcdfba76', '194128377819252@lid', 'Hussein Ali', 'Hussein Ali', NULL, 0, '2025-12-18 10:08:31', '2025-12-18 10:08:31', NULL, NULL, NULL),
('3c0808fe-be92-4391-8f2f-beef86f72863', '201001742924@s.whatsapp.net', '201001742924', NULL, NULL, 0, '2025-12-18 01:09:35', '2025-12-18 11:12:54', NULL, NULL, NULL),
('496794b1-ef16-49e5-bfd0-be3943fb2764', '11244341882973@lid', 'Ayman Makhlouf', 'Ayman Makhlouf', NULL, 0, '2025-12-18 10:08:12', '2025-12-18 10:08:12', NULL, NULL, NULL),
('4eccf2fb-4658-46ee-821d-a838ef1d8fe0', '201018441046-1630282106@g.us', 'mohamedelmahdy646', 'mohamedelmahdy646', NULL, 0, '2025-12-17 22:07:02', '2025-12-17 22:07:07', NULL, NULL, NULL),
('4eea8343-163f-4d92-acc7-24db5c31c2c7', '120363399718987596@g.us', '120363399718987596', NULL, NULL, 1, '2025-12-19 14:45:18', '2025-12-19 14:45:18', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('52f80a0a-4ece-4527-8734-a8ce5b344229', '151707321426058@lid', 'Joey😎', 'Joey😎', NULL, 0, '2025-12-18 11:09:02', '2025-12-18 11:09:02', NULL, NULL, NULL),
('53cc5730-8c1e-4945-8bb4-c3cef385a66c', '184185713111249@lid', 'احمد مراد عيسى', 'احمد مراد عيسى', NULL, 0, '2025-12-18 10:30:27', '2025-12-18 11:17:29', NULL, NULL, NULL),
('5d2f242f-92b4-4b30-b7e7-7a0c1cfeca7b', '21728793256023@lid', 'baselmetwally', 'baselmetwally', NULL, 0, '2025-12-18 10:57:34', '2025-12-18 10:57:34', NULL, NULL, NULL),
('5eafaec2-633c-4f99-961b-d17e7fa7f606', '90980359352449@lid', 'Tarek', 'Tarek', NULL, 0, '2025-12-18 10:08:11', '2025-12-18 10:08:11', NULL, NULL, NULL),
('62d27910-6ae2-4d97-99b2-ffbc4bbcf6d5', '201273835923@s.whatsapp.net', '201273835923', NULL, NULL, 0, '2025-12-19 00:50:42', '2025-12-20 05:14:14', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('63befa1d-1b31-4eab-965b-25d8dee8990c', '1578300153@broadcast', 'AAbdElrahem', 'AAbdElrahem', NULL, 0, '2025-12-20 04:39:56', '2025-12-20 04:39:56', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('694a11b2-c2ae-4004-b2c0-65091b570b9e', '131731445301341@lid', 'AHMED SAYED SHOMAN', 'AHMED SAYED SHOMAN', NULL, 0, '2025-12-18 10:07:58', '2025-12-18 10:07:58', NULL, NULL, NULL),
('6e41b5fd-dcdb-40af-82b3-fd1b4a7f9da4', '262027415187523@lid', 'Essawy Hamid', 'Essawy Hamid', NULL, 0, '2025-12-20 04:39:05', '2025-12-20 04:39:27', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('73276941-08d6-47dc-abc2-724d5224afee', '25709741346859@lid', 'Totatoys', 'Totatoys', NULL, 0, '2025-12-18 10:07:57', '2025-12-18 10:07:57', NULL, NULL, NULL),
('75ccb6c1-b58c-44b6-963f-15d7657f3f96', '120363421536577519@g.us', '120363421536577519', NULL, NULL, 1, '2025-12-19 13:12:04', '2025-12-19 16:21:48', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('78316953-0fdf-4911-955d-77f5273cbe88', '201006348127@s.whatsapp.net', 'علاء فايد', 'علاء فايد', NULL, 0, '2025-12-18 10:08:12', '2025-12-18 10:08:17', NULL, NULL, NULL),
('78b6b6f5-7968-4c40-97ee-5cc547063a0e', '20947008491568@lid', '20947008491568', NULL, NULL, 0, '2025-12-17 22:14:54', '2025-12-17 22:15:12', NULL, NULL, NULL),
('7a15dc01-f1c3-4ade-b2ef-7e2f71a0991f', '229149557964900@lid', 'AHMED RAMADAN', 'AHMED RAMADAN', NULL, 0, '2025-12-18 10:45:29', '2025-12-18 10:52:49', NULL, NULL, NULL),
('7fbd7df0-69d1-4383-9346-bca9bc2a5994', '57324995641379@lid', 'Abdelrahman_altohami', 'Abdelrahman_altohami', NULL, 0, '2025-12-18 10:57:02', '2025-12-18 10:59:17', NULL, NULL, NULL),
('8a31b3f4-4924-4cdb-901f-801607ee659c', '254365713613015@lid', 'mohamed roshdy', 'mohamed roshdy', NULL, 0, '2025-12-18 10:07:58', '2025-12-18 10:53:31', NULL, NULL, NULL),
('9038147c-6e8a-4291-8fc0-b05e7b0145f6', '242768882471007@lid', 'Mohammad', 'Mohammad', NULL, 0, '2025-12-18 02:19:41', '2025-12-18 08:58:23', NULL, NULL, NULL),
('91c3ef68-2316-454e-930a-d22b2e9071e1', '201014738598-1564967675@g.us', '201014738598-1564967675', NULL, NULL, 1, '2025-12-20 04:39:05', '2025-12-20 04:39:27', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('937b434b-30cc-474a-872f-af6f288b994f', '190207492112386@lid', 'byr374053', 'byr374053', NULL, 0, '2025-12-18 10:10:34', '2025-12-18 10:10:34', NULL, NULL, NULL),
('9d437ca8-883c-4d3c-88bb-60547db8c3de', '142446969274381@lid', 'Ahmed', 'Ahmed', NULL, 0, '2025-12-18 10:22:09', '2025-12-18 10:22:09', NULL, NULL, NULL),
('9da2f5eb-6f2e-44d6-a1d0-c9f767413d1c', '5551234567@s.whatsapp.net', 'Mock Sender', 'Mock Sender', NULL, 0, '2025-12-17 14:24:25', '2025-12-17 14:24:25', 'ca85fe1d-c906-48e6-8b19-b43df5b4eb76', NULL, NULL),
('9dc83203-e6e3-4657-a336-39569bcb090f', '120363365508284247@g.us', 'كنترول شوب', NULL, NULL, 1, '2025-12-18 08:58:38', '2025-12-18 10:08:31', NULL, NULL, NULL),
('a1fecaa9-c8f7-4a99-befe-469198b1a708', 'status@broadcast', 'Taha Ali', 'Taha Ali', NULL, 0, '2025-12-18 08:58:50', '2025-12-18 11:02:43', NULL, NULL, NULL),
('ab77452a-9e24-406d-9b73-48a9ee1613fd', '120363391562841494@g.us', 'Ahmed Rabie', NULL, NULL, 1, '2025-12-18 01:57:01', '2025-12-18 11:09:13', NULL, NULL, NULL),
('ab9126b3-a585-4778-b323-644911e74145', '120363403291850277@g.us', 'Abdullah Mohamed', NULL, NULL, 1, '2025-12-18 08:58:48', '2025-12-18 11:18:06', NULL, NULL, NULL),
('be4a62fa-7541-4fb3-9897-af887844147f', '120363317203633732@g.us', 'mahmoud zaki', NULL, NULL, 1, '2025-12-18 08:58:51', '2025-12-18 10:37:53', NULL, NULL, NULL),
('bf154819-d1f9-4314-9f12-6d4ca93b0177', '194686723616922@lid', 'Dr.Bob', 'Dr.Bob', NULL, 0, '2025-12-18 10:58:48', '2025-12-18 11:02:27', NULL, NULL, NULL),
('bfae8323-07d7-4987-9310-e32d303292be', '217342676054016@lid', 'mahmoud tarek', 'mahmoud tarek', NULL, 0, '2025-12-18 10:37:54', '2025-12-18 10:37:54', NULL, NULL, NULL),
('c126ae75-d4ab-4989-a04f-265069522392', '43598481477887@lid', 'Shady Rasmy', 'Shady Rasmy', NULL, 0, '2025-12-18 10:07:57', '2025-12-18 10:08:16', NULL, NULL, NULL),
('c2f74c69-c253-4bc7-9393-e29ab10471b4', '112485713608923@lid', 'Md Yousuf Ali', 'Md Yousuf Ali', NULL, 0, '2025-12-19 13:12:04', '2025-12-19 13:12:04', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('c47b079b-1c86-4abd-84ea-62d192267d6e', '43031948427293@lid', 'Khan', 'Khan', NULL, 0, '2025-12-19 13:16:38', '2025-12-19 13:16:38', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('c8db8171-2f86-4e7a-ae12-d5b7d9589c13', '201001787466-1500216122@g.us', '201001787466-1500216122', NULL, NULL, 1, '2025-12-18 10:08:11', '2025-12-18 10:08:11', NULL, NULL, NULL),
('d708844e-21ce-41c6-ae6e-690201ab853d', '201273835923@s.whatsapp.net', '201273835923', NULL, NULL, 0, '2025-12-18 23:21:20', '2025-12-18 23:30:32', NULL, NULL, NULL),
('df895282-0e65-42a7-9aea-55cc1eb9e02f', '65386817036493@lid', 'Hossam Attef', 'Hossam Attef', NULL, 0, '2025-12-18 11:18:06', '2025-12-18 11:18:06', NULL, NULL, NULL),
('e0829191-b629-4d2e-b7e0-226c18adf551', '201211149731-1507909648@g.us', 'Gina Magdy', 'Gina Magdy', NULL, 0, '2025-12-18 08:58:49', '2025-12-18 08:58:49', NULL, NULL, NULL),
('e39c4a1d-6440-4386-8e7d-1635c15bf8c3', '221109228142633@lid', 'Karem.R', 'Karem.R', NULL, 0, '2025-12-18 11:04:53', '2025-12-18 11:04:53', NULL, NULL, NULL),
('e4a00684-b53d-4188-84c3-b42ad5b77fcc', '218060136968399@lid', 'zad', 'zad', NULL, 0, '2025-12-18 10:28:45', '2025-12-18 10:29:49', NULL, NULL, NULL),
('e763fe32-7ac8-41fa-bd6b-692693ea38fc', '210994697654524@lid', 'Shady Rasmy', 'Shady Rasmy', NULL, 0, '2025-12-19 06:19:54', '2025-12-19 12:26:08', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('e82db7bf-136c-4b2e-995a-b5d41a4ada09', '201001742924@s.whatsapp.net', '201001742924', NULL, NULL, 0, '2025-12-18 02:06:40', '2025-12-18 11:15:30', NULL, NULL, NULL),
('eeab2ac1-fe8a-4b8c-9855-114639d3406e', '178980195971294@lid', 'Vikram Yadav', 'Vikram Yadav', NULL, 0, '2025-12-19 16:21:48', '2025-12-19 16:21:48', NULL, NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f6a69d1b-21af-4d38-af51-4308928086af', '201273835923@s.whatsapp.net', 'Marketing', 'Marketing', NULL, 0, '2025-12-18 02:06:44', '2025-12-18 11:15:30', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) DEFAULT 'USD',
  `status` enum('pending','paid','failed','cancelled') DEFAULT 'pending',
  `plan_name` varchar(255) NOT NULL,
  `billing_period_start` datetime NOT NULL,
  `billing_period_end` datetime NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `message_id` varchar(255) NOT NULL,
  `jid` varchar(255) NOT NULL,
  `from_me` tinyint(1) DEFAULT '0',
  `type` varchar(255) DEFAULT 'text',
  `content` text,
  `media_url` text,
  `status` enum('pending','sent','delivered','read','failed') DEFAULT 'sent',
  `timestamp` datetime NOT NULL,
  `quoted_message_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `instance_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `sender_jid` varchar(255) DEFAULT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `message_id`, `jid`, `from_me`, `type`, `content`, `media_url`, `status`, `timestamp`, `quoted_message_id`, `createdAt`, `updatedAt`, `instance_id`, `sender_jid`, `sender_name`, `user_id`) VALUES
('02133c76-7203-4d52-8bab-4036e9870241', 'AC32C23DA5B4AE13967424038516702A', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:21:11', NULL, '2025-12-20 04:22:31', '2025-12-20 04:22:31', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('03f48bc7-37a1-4ccc-8587-2d7ca4c52071', 'AC12B13E4EAAC6D8C987B3EA1A985750', '1578300153@broadcast', 0, 'senderKeyDistribution', 'https://www.instagram.com/reel/DScXf8WiIoT/?igsh=MWVjaTVqOXpxcGs3ag==', NULL, 'sent', '2025-12-20 04:27:37', NULL, '2025-12-20 04:39:56', '2025-12-20 04:39:56', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '72121208279169@lid', 'AAbdElrahem', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('04592e61-ba9e-4c52-bcbe-c2839b20597b', 'A52141B267284D666389921CF55FA7D1', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:46', NULL, '2025-12-18 23:21:46', '2025-12-18 23:21:46', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('063d28b8-bf1e-4144-8d3c-4ad6ca17b59b', 'AC1EDA1F24E81FEF2CA6CFAAD570EF26', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:30:59', NULL, '2025-12-20 04:40:17', '2025-12-20 04:40:17', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('0b789843-3d7d-4f34-a04f-d1672bf75361', 'A56829AED138C79C7A09CD0D4A99CED8', '120363421536577519@g.us', 0, 'senderKeyDistribution', '👍', NULL, 'sent', '2025-12-19 13:19:02', NULL, '2025-12-19 13:19:03', '2025-12-19 13:19:03', NULL, '195253642522659@lid', 'Wahyu WB', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('0cf3b35f-47e9-4d77-8d03-ee19297706cc', 'A53EF7EDB10E97A6BA9F43F15F72C935', '242768882471007@lid', 1, 'text', 'اتفعل', NULL, 'sent', '2025-12-18 02:43:48', NULL, '2025-12-18 08:58:19', '2025-12-18 08:58:19', NULL, NULL, NULL, NULL),
('0e01cadf-921b-456e-a0b2-49d31922405e', 'ACD5CFCBAE6E768E788E0EE94F4D5039', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:29:32', NULL, '2025-12-20 04:40:11', '2025-12-20 04:40:11', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('0ec664d4-ebbc-4c1d-a11a-38ecd76094f4', 'AC7D939AC99B8C5D62D9BAC18932D6CA', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:26:23', NULL, '2025-12-20 04:39:35', '2025-12-20 04:39:35', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('0f2f9f06-40a5-41a4-8779-97a9c6541eb3', 'ACAF61C47C7F8DDB14367AAEC39A6628', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:29', NULL, '2025-12-20 04:39:53', '2025-12-20 04:39:53', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('0f41fbd4-32b0-4f36-8de0-3a3843ac9801', 'AC2323CAD758B9DA06828A4B7FF1044F', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:18:38', NULL, '2025-12-18 01:56:10', '2025-12-18 01:56:10', NULL, NULL, NULL, NULL),
('11592e67-b197-4569-8097-80a0476fbf4f', 'MOCK_1765981985992', '5551234567@s.whatsapp.net', 0, 'text', 'Hello! This is a test message injected directly into the DB. 🚀', NULL, 'delivered', '2025-12-17 14:33:06', NULL, '2025-12-17 14:33:06', '2025-12-17 14:33:06', 'ca85fe1d-c906-48e6-8b19-b43df5b4eb76', NULL, NULL, NULL),
('12dc0e03-2cf6-4119-84af-5399f3a81ad5', 'AC20983899D4918B161733D69BCC1E14', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:28:30', NULL, '2025-12-18 01:56:45', '2025-12-18 01:56:45', NULL, NULL, NULL, NULL),
('13c62178-7713-4cc3-9ba4-b1c55277a300', 'ACA340F99A21A0E2CB7F6E4489565B01', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:22:33', NULL, '2025-12-20 04:24:28', '2025-12-20 04:24:28', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('1431c1da-af7b-420c-9ef7-8f1778b272a7', 'ACE5B9EB82B82A22824F3B5570D08CB4', '120363403291850277@g.us', 0, 'text', 'اه تمام ماشي ولو في عربي ياريت', NULL, 'sent', '2025-12-18 10:49:09', NULL, '2025-12-18 10:50:26', '2025-12-18 10:50:26', NULL, '229149557964900@lid', 'AHMED RAMADAN', NULL),
('1453637a-79d7-4711-a997-826b41a084d7', 'A538D0135F6C0BEA562427413054FBDE', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:26', NULL, '2025-12-18 23:21:26', '2025-12-18 23:21:26', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('18575948-45f5-4df1-8c92-e7a380dc0b0d', 'AC0AD770BBCD1578D97F8D8620CA2788', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:19:25', NULL, '2025-12-18 01:56:13', '2025-12-18 01:56:13', NULL, NULL, NULL, NULL),
('19c66d4e-c177-4864-96c5-cf46e646e3d6', 'AC1D4409E7942333055972DB879927EB', '242768882471007@lid', 0, 'text', 'تمام شكرا جدا', NULL, 'sent', '2025-12-18 02:44:03', NULL, '2025-12-18 08:58:20', '2025-12-18 08:58:20', NULL, NULL, NULL, NULL),
('1a1b848e-fc0a-46ee-b5cd-1a70954a424b', 'A567DD659B62189AFA63701794AA840B', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:20', NULL, '2025-12-18 23:21:20', '2025-12-18 23:21:20', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('1a692fcb-42b9-4597-9c2d-e0094908ed0c', 'A5B5F967E9B3BF0A459DDB6AC4D5481F', '120363317203633732@g.us', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 10:28:06', NULL, '2025-12-18 10:29:23', '2025-12-18 10:29:23', NULL, '218060136968399@lid', 'zad', NULL),
('1aad9150-41f7-475c-998c-7162000c518e', 'AC88628B51AEFEEC66A43BB4735243B5', '120363403291850277@g.us', 0, 'text', 'بتكلم ع المحتوي\nفي حاجه شبه كدا انجلش', NULL, 'sent', '2025-12-18 10:48:33', NULL, '2025-12-18 10:49:50', '2025-12-18 10:49:50', NULL, '254365713613015@lid', 'mohamed roshdy', NULL),
('1be3a8b1-9970-498e-bbfe-90bbcaf40401', '42415C4825F10E5351CBC0744501CE5A', '242768882471007@lid', 0, 'audio', '🎤 Audio', 'http://localhost:3000/public/uploads/1766024380577-7102.ogg', 'sent', '2025-12-18 02:18:23', NULL, '2025-12-18 02:19:41', '2025-12-18 02:19:41', NULL, NULL, NULL, NULL),
('1c69657c-d2cf-4266-8046-442992519213', 'ACB423C8C9020784F3C7AEF6C6EE767B', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:26:37', NULL, '2025-12-18 01:56:40', '2025-12-18 01:56:40', NULL, NULL, NULL, NULL),
('1db2ca2d-edf2-46e5-b93d-ab15e2ab2663', 'AC7DC57A396FA34303633D3907D55791', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:21:20', NULL, '2025-12-20 04:22:44', '2025-12-20 04:22:44', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('1db33ab8-ccc1-4dfb-b36a-6a303dfffe4c', 'AC1D7A537CB311AC66C43A9D2E758E3F', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:24:13', NULL, '2025-12-18 01:56:30', '2025-12-18 01:56:30', NULL, NULL, NULL, NULL),
('20e9f9a5-0662-48a8-b4bd-20cbfcfb66ac', 'A51FC735C342A152F65AE6DEF4AF5C28', '209787845398651@lid', 0, 'text', 'ايه الاخبار', NULL, 'sent', '2025-12-20 04:44:37', NULL, '2025-12-20 04:45:54', '2025-12-20 04:45:54', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '209787845398651@lid', 'Marketing', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('23d0709a-79f3-4907-ae67-64524864be18', 'ACE596F30555F1E589093C1EFBEB1207', '120363365508284247@g.us', 0, 'text', 'بس انا محتجتهاش ابدا', NULL, 'sent', '2025-12-18 04:45:46', NULL, '2025-12-18 08:58:47', '2025-12-18 08:58:47', NULL, NULL, NULL, NULL),
('245c5ac0-17c7-4d20-a35b-98c83bfd8256', 'ACC898E952D86F9746D74025D7B9983D', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:31:51', NULL, '2025-12-20 04:40:20', '2025-12-20 04:40:20', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('25899309-15fc-4cc5-9994-822bab546aed', 'AC41F0AF225A88AAC8407D1F42CED547', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:25:46', NULL, '2025-12-20 04:39:20', '2025-12-20 04:39:20', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('2661ae50-2cbf-4642-89a0-f6fa5c094da9', 'ACDB2128950E69273DF1936D9B73F359', '120363317203633732@g.us', 0, 'senderKeyDistribution', '❤️', NULL, 'sent', '2025-12-18 10:36:32', NULL, '2025-12-18 10:37:54', '2025-12-18 10:37:54', NULL, '217342676054016@lid', 'mahmoud tarek', NULL),
('2894f9db-5b5d-4d6a-b677-4c99f71c31a8', 'A580AFF733747DC86A8E191D5C9A8BEA', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:30:20', NULL, '2025-12-18 23:30:21', '2025-12-18 23:30:21', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('2beff2f1-d17a-467a-a543-7a87fb13a0a8', 'A592DE49AFD4EEFC156A1C1E9400A3D2', '120363365508284247@g.us', 0, 'text', 'عنياه', NULL, 'sent', '2025-12-18 07:52:06', 'AC459013369E12091AE72C95EEA87153', '2025-12-18 08:58:54', '2025-12-18 08:58:54', NULL, NULL, NULL, NULL),
('2c5da8ce-3539-415e-a4ee-0eef21a3c5ed', 'AC1B96A5D0CD6FE7842B1E90592FEB93', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:27:53', NULL, '2025-12-18 01:56:43', '2025-12-18 01:56:43', NULL, NULL, NULL, NULL),
('2d007378-e6d6-4cf0-9fca-63328934c050', 'AC528715FFA7A91E01976CD0285C1968', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:24:22', NULL, '2025-12-20 04:38:58', '2025-12-20 04:38:58', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('2d5cdeba-1081-4e4a-821e-bc529fdce98e', 'A5796EA7D7F6AA48A10CCEB611B150D5', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:21', NULL, '2025-12-18 23:21:21', '2025-12-18 23:21:21', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('2e223abd-eda6-48af-8423-c269698182b6', 'AC8B0DCCC709B40A55F136C3E0E1272D', '120363421536577519@g.us', 0, 'messageContextInfo', '❤️', NULL, 'sent', '2025-12-19 13:19:17', NULL, '2025-12-19 13:19:18', '2025-12-19 13:19:18', NULL, '19010045358154@lid', 'Asir Hossain', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('2ebc2ad1-2b16-41e8-884e-ca174c899705', 'AC01FAACA2995D32F0C30E7B58406FB3', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:23:30', NULL, '2025-12-18 01:56:25', '2025-12-18 01:56:25', NULL, NULL, NULL, NULL),
('2f861644-4ebc-4ee0-83c3-50f36c7b7420', 'AC99ED079658F09AFB8C7BD3908B717A', '242768882471007@lid', 0, 'image', '📷 Image', 'http://localhost:3000/public/uploads/1766048298623-9540.jpg', 'sent', '2025-12-18 02:43:37', NULL, '2025-12-18 08:58:18', '2025-12-18 08:58:18', NULL, NULL, NULL, NULL),
('2fab4292-af29-40dc-88c1-531c37b26718', 'AC799A99E1CB10EF7A07DAD69630AEC1', '120363365508284247@g.us', 0, 'text', 'ايوة حقيقي الديجتال شغال عادي', NULL, 'sent', '2025-12-18 04:46:03', 'ACD16BB19D1B2D33FD4C42CBFC1CBAE9', '2025-12-18 08:58:47', '2025-12-18 08:58:47', NULL, NULL, NULL, NULL),
('30151942-34f4-4a5e-a981-f67ad76b3717', 'AC04591F197B05285FCC990D09A15A84', '210994697654524@lid', 0, 'text', 'وماله', NULL, 'sent', '2025-12-19 12:26:07', NULL, '2025-12-19 12:26:08', '2025-12-19 12:26:08', NULL, '210994697654524@lid', 'Shady Rasmy', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('314937df-7748-4dee-af79-d0b2795442fc', 'MOCK_1765981465145', '5551234567@s.whatsapp.net', 0, 'text', 'Hello! This is a test message injected directly into the DB. 🚀', NULL, 'delivered', '2025-12-17 14:24:25', NULL, '2025-12-17 14:24:25', '2025-12-17 14:24:25', 'ca85fe1d-c906-48e6-8b19-b43df5b4eb76', NULL, NULL, NULL),
('3160d630-3ec1-47a9-92b0-b12e1be2aaf4', 'AC2E4FDF08536A38567C5F4AD0686BFE', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:22:29', NULL, '2025-12-20 04:24:26', '2025-12-20 04:24:26', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('3346ad35-2282-4884-8520-5fee0faaccfa', '3EB02A61A4CEFB4DCEC845', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 02:06:37', NULL, '2025-12-18 02:06:40', '2025-12-18 02:06:43', NULL, NULL, NULL, NULL),
('34d47c37-3418-4cf2-9877-491513bb1539', 'AC633E49EB4B700A38DE220487EE27CA', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:30:38', NULL, '2025-12-18 01:56:56', '2025-12-18 01:56:56', NULL, NULL, NULL, NULL),
('365a70ca-0358-480f-afda-c5349b8ee0e9', 'ACFDB2DCFEBBD83B3B708A72B8C0B445', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:25:07', NULL, '2025-12-20 04:39:14', '2025-12-20 04:39:14', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('36760111-0288-4ca8-8de6-87f8a7569ed5', 'AC8D4986293306AAB129D111180518B2', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:46', NULL, '2025-12-20 04:39:56', '2025-12-20 04:39:56', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('389829c8-7207-45e2-a4b8-11c605315382', 'AC48C96712DB1666CC6A8042D4604A68', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:23:48', NULL, '2025-12-20 04:26:35', '2025-12-20 04:26:35', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('38b59e41-74e0-4860-8a65-a559a2106583', 'A538459C5F8A59558891A46BCD13ACD2', '120363391562841494@g.us', 0, 'senderKeyDistribution', '71% of CEOs feel overwhelmed.\n\nNot because they lack talent.\n\nBecause they lack a system.\n\nAfter advising Fortune 50 CEOs for 20 years,\nI see the same pattern:\n\n→ Scattered focus across too many priorities\n→ Meetings that consume thinking time\n→ Reactive days instead of strategic ones\n\nYou don\'t need to work harder.\nYou need to work with intention.\n\nThe best CEOs don\'t manage time.\nThey architect it.\n\nHere\'s the weekly structure that separates\nhigh-impact leaders from the overwhelmed:\n\nMONDAY – Week Launch & Priority Setting\nStart strong by setting 3 must-wins before chaos hits.\nYour Monday morning determines your entire week\'s trajectory.\n\nTUESDAY – Execution & Team Building\nTackle your biggest bottleneck when energy peaks.\nBuild your team\'s capability while driving results.\n\nWEDNESDAY – Market & Relationships\nStep outside your bubble. Meet customers, advisors, partners.\nThe best insights come from beyond your walls.\n\nTHURSDAY – Strategic Work & Innovation\nProtect this day fiercely. No interruptions.\nWork on ONE big bet that moves your company forward.\n\nFRIDAY – Review & Preparation\nMeasure what matters. Plan next week\'s attack.\nLeave by 3pm – recovery drives performance.\n\nBut here\'s what most CEOs miss:\n\nThe power isn\'t in the schedule.\nIt\'s in the discipline to protect it.\n\nEvery week, commit to these 6 actions:\n\n□ Delegate what others can do 80% as well\n□ Simplify by killing one outdated process\n□ Protect your focus from non-critical meetings\n□ Connect meaningfully with a direct report\n□ Learn from customers, data, or market intelligence\n□ Celebrate a team win publicly\n\nHigh-impact leadership isn\'t about\nperfecting every hour.\n\nIt\'s about being intentional with the hours\nthat determine everything else.\n\nYour board needs strategic thinking, not firefighting.\n\nYour team needs clarity, not chaos.\n\nYour company needs a CEO at full power.\n\nStop measuring hours worked.\nStart measuring strategic impact.', NULL, 'sent', '2025-12-18 11:07:50', NULL, '2025-12-18 11:09:08', '2025-12-18 11:09:08', NULL, '229170982420646@lid', 'Mohamed Abuelela', NULL),
('3ae4bc74-caf7-4600-801a-fc7874bc394f', 'A56223062947D77B6123A9E17DD57BB9', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:30:31', NULL, '2025-12-18 23:30:32', '2025-12-18 23:30:32', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('3b77ed6f-795c-4e73-a31d-3de07f3e7009', 'A55DDB3193C7B10A2B7159B8DB9B7F3D', '120363365508284247@g.us', 0, 'text', 'ايوة بس اخرها تدفع غرامه كبيره لا تقل عن 100 الف ج وتخرج مدفعتش تتحبس \n\n  وحاليا شركة we بتحظر السيرفرات دى ولكن أصحاب السيرفرات بيستخدمه LOCAL HOST من اجهزة VPS عشان ما يتعرفش مكانهم', NULL, 'sent', '2025-12-18 08:15:25', 'ACD7BBD3688A53B3ECECD81CAB205F52', '2025-12-18 08:58:59', '2025-12-18 08:58:59', NULL, NULL, NULL, NULL),
('3b89a168-4234-4c7d-927f-db8f9eb35c79', 'AC3BC8CDCB63BCD6C7B917E68B59FFB6', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:23:05', NULL, '2025-12-20 04:24:34', '2025-12-20 04:24:34', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('3bfe24a6-eba7-400c-a9b5-b5fe7e3c5125', 'AC1A5E15B63C26E7EF67FF64E6543E8A', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:25:42', NULL, '2025-12-18 01:56:33', '2025-12-18 01:56:33', NULL, NULL, NULL, NULL),
('3cb3488f-0a27-451c-8b71-43d90896860a', 'A53765E32DF2648269793E0BAFAE1AAC', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:51:38', NULL, '2025-12-19 00:51:38', '2025-12-19 00:51:38', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('3f12404c-8045-4e54-a5c2-516c5650c376', 'ACD7BBD3688A53B3ECECD81CAB205F52', '120363365508284247@g.us', 0, 'text', 'وممكن يودي للسجن', NULL, 'sent', '2025-12-18 08:12:37', NULL, '2025-12-18 08:58:59', '2025-12-18 08:58:59', NULL, NULL, NULL, NULL),
('3fe592b8-1483-4cdd-bc86-b949b4b88861', '3EB0D722019BD8BC15FD37', '201273835923@s.whatsapp.net', 1, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 02:07:48', NULL, '2025-12-18 02:07:52', '2025-12-18 02:07:52', NULL, NULL, NULL, NULL),
('40ec9bc0-3f77-4832-b59e-ee718963f347', '3EB0B59220EA41E41088A4', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 23:33:51', NULL, '2025-12-18 23:33:53', '2025-12-18 23:33:53', NULL, 'me', 'Me', NULL),
('41ed8e4f-c106-4b3e-a421-c3e9af1334c0', '3EB07F6A8EE6692094D8EA', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-19 00:54:31', NULL, '2025-12-19 00:54:32', '2025-12-19 00:54:32', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('42174cff-6a28-4762-9876-733d33d50343', 'ACDB8DF101F39D85485297CF64862079', '201014738598-1564967675@g.us', 0, 'audio', '🎤 Audio', 'http://localhost:3000/public/uploads/1766205559621-1767.ogg', 'sent', '2025-12-20 04:24:59', NULL, '2025-12-20 04:39:20', '2025-12-20 04:39:20', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('42e9c362-1d49-4529-8622-e1a16619b95c', 'ACB853F291FDBEF56B735F0293B87E44', '120363421536577519@g.us', 0, 'senderKeyDistribution', '❤️', NULL, 'sent', '2025-12-19 13:16:38', NULL, '2025-12-19 13:16:38', '2025-12-19 13:16:38', NULL, '43031948427293@lid', 'Khan', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('43700155-e290-48ff-936d-03e679895804', 'AC79ACF8AC04392230E49BCB3F94C2F3', '210994697654524@lid', 0, 'sticker', 'stickerMessage', NULL, 'sent', '2025-12-19 06:20:15', NULL, '2025-12-19 06:20:16', '2025-12-19 06:20:16', NULL, '210994697654524@lid', 'Shady Rasmy', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('448f04eb-ca71-44a1-bea6-6d766303eed0', 'ACCC950E06F04858E8915FB94AD5B466', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:21:57', NULL, '2025-12-20 04:24:22', '2025-12-20 04:24:22', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('44bb3e07-4faf-423d-97cd-5684195724b4', '3EB056BC2184A516C35A3C', '210994697654524@lid', 1, 'text', 'تمام', NULL, 'sent', '2025-12-19 06:21:14', NULL, '2025-12-19 06:21:14', '2025-12-19 06:21:14', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('45ed4dc2-c868-4c1b-b5a4-65e3ea30bcaa', 'ACCB0FB57ED726B76649A249384E5CC6', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:25:09', NULL, '2025-12-18 01:56:31', '2025-12-18 01:56:31', NULL, NULL, NULL, NULL),
('460e4c42-6909-4138-8e58-0f5669992253', '3EB09295CA7171AFF1B9BA', '201273835923@s.whatsapp.net', 1, 'text', 'tamam', NULL, 'sent', '2025-12-20 04:44:19', NULL, '2025-12-20 04:44:20', '2025-12-20 04:44:20', '4485e768-c912-4a42-87d5-e9b0d71cec0f', 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('46c9434a-e8b2-41dd-8ebe-cc70202f89ba', 'ACB6116119D0575C87E1D41836D242E2', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:22:11', NULL, '2025-12-20 04:24:25', '2025-12-20 04:24:25', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('48ff5e26-ec52-4997-93db-72da894f15de', '3EB0D722019BD8BC15FD37', '201001742924@s.whatsapp.net', 0, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 02:06:36', NULL, '2025-12-18 02:07:52', '2025-12-18 02:07:52', NULL, NULL, NULL, NULL),
('49b5e1ff-166f-467b-9fd1-3046b6ff5c94', 'AC00709DF5BD2DA531D518BA50FBFC46', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:21:22', NULL, '2025-12-20 04:22:45', '2025-12-20 04:22:45', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('4a9851e8-4f8d-4588-a0af-016493af3428', '3EB0F15D59E19FB8118AC9', '120363365508284247@g.us', 0, 'text', 'مفهمتش', NULL, 'sent', '2025-12-18 03:04:37', '3A57DA929A0D32C850CB', '2025-12-18 08:58:39', '2025-12-18 08:58:39', NULL, NULL, NULL, NULL),
('4b948f08-65c8-4a9c-9510-0fb629c5ddf7', 'A57784C3457453D1C66D05072126620A', '120363317203633732@g.us', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 10:27:39', NULL, '2025-12-18 10:28:58', '2025-12-18 10:28:58', NULL, '218060136968399@lid', 'zad', NULL),
('4dfaade1-2a30-4bc5-8d02-9f65fdd289ef', 'A54185BAAF7B1CFA367747BC80264AE4', '209787845398651@lid', 0, 'text', 'ازيك', NULL, 'sent', '2025-12-20 04:42:50', NULL, '2025-12-20 04:44:07', '2025-12-20 04:44:07', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '209787845398651@lid', 'Marketing', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('4f96bea3-3b81-4a32-8089-28df6a0b2410', 'ACBB11CD4B100965C67CF3386686C4F4', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:22:44', NULL, '2025-12-18 01:56:22', '2025-12-18 01:56:22', NULL, NULL, NULL, NULL),
('4fcc1654-15b2-4cf7-9ae7-64175fb156f1', 'AC25AD18F280E77E17C4A43635997B36', '43598481477887@lid', 1, 'text', 'اه عادي', NULL, 'sent', '2025-12-18 10:00:01', NULL, '2025-12-18 10:08:16', '2025-12-18 10:08:16', NULL, 'me', 'Me', NULL),
('4fd08f7d-4a5e-4752-b539-a1c88c6618e4', '3EB081BAF0224D2E18367C', '201006348127@s.whatsapp.net', 0, 'text', 'يعني في اوبشن يكون دارك ومربوط واتس مش كوفنرجرن ويب سايت صح', NULL, 'sent', '2025-12-18 10:01:19', NULL, '2025-12-18 10:08:17', '2025-12-18 10:08:17', NULL, '201006348127@s.whatsapp.net', 'علاء فايد', NULL),
('519ef292-cd6e-4a9c-a82e-37532b32d236', '3EB0C7A97D6C1D079A57CF', '201273835923@s.whatsapp.net', 1, 'text', 'ok', NULL, 'sent', '2025-12-18 02:08:45', NULL, '2025-12-18 02:08:52', '2025-12-18 02:08:52', NULL, NULL, NULL, NULL),
('51d14fbb-0fe8-41bb-a926-3b8e95e6e818', 'A5DF181D49214D927278327A02DE3411', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:50:42', NULL, '2025-12-19 00:50:42', '2025-12-19 00:50:42', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('52053859-72f6-4fd0-9732-a74ab75b8bd2', 'AC458D6CDBD2934525361D08CD5EABAD', '120363403291850277@g.us', 0, 'text', 'كنت عايز مصادر لتعلم answer engine optimization لو فيه ترشيح ياريت', NULL, 'sent', '2025-12-18 10:44:07', NULL, '2025-12-18 10:45:30', '2025-12-18 10:45:30', NULL, '229149557964900@lid', 'AHMED RAMADAN', NULL),
('5290c82f-c338-4378-bbef-b3204c029bd1', 'ACF47B2E52F622AFE4474F62BE0B882F', '201014738598-1564967675@g.us', 0, 'text', '133_ ذكريات طالوت في منتصف رمضان', NULL, 'sent', '2025-12-20 04:24:49', NULL, '2025-12-20 04:39:07', '2025-12-20 04:39:07', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('52a36348-8048-4f52-9b2c-696d5aeb6927', '3EB08D7839D3C799A5F1DC', '201273835923@s.whatsapp.net', 1, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-20 04:41:30', NULL, '2025-12-20 04:41:31', '2025-12-20 04:41:32', '4485e768-c912-4a42-87d5-e9b0d71cec0f', 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('531a2ba0-db20-4d82-9bbd-2b4a4f78f8ba', 'AC9DB82B068968F67971EA41C14E85FA', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:28:04', NULL, '2025-12-20 04:40:03', '2025-12-20 04:40:03', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('54c87a50-d9ef-410f-82e2-4eb49c5d3fd7', 'A5A4083FF9650152854341632116B1E5', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:51:31', NULL, '2025-12-19 00:51:32', '2025-12-19 00:51:32', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('54f4d686-1bf4-4b6c-85b2-4c72d268d5c5', '3EB0B59220EA41E41088A4', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 23:33:51', NULL, '2025-12-18 23:33:53', '2025-12-18 23:33:53', NULL, 'me', 'Me', NULL),
('578f5988-707a-42ea-87a8-179dd09a2ab8', 'ACFC8BD682B7AED60D8078C4AFF223DB', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'senderKeyDistributionMessage', NULL, 'sent', '2025-12-18 11:16:42', NULL, '2025-12-18 11:18:06', '2025-12-18 11:18:06', NULL, '65386817036493@lid', 'Hossam Attef', NULL),
('5b8e779f-28db-4ba4-9964-d3b4d653bd0d', '3EB02778BB0D66F73D8BAC', '201273835923@s.whatsapp.net', 1, 'text', 'teslm', NULL, 'sent', '2025-12-20 04:44:40', 'A5305671233404D9F924A3D4C73CCA1A', '2025-12-20 04:44:41', '2025-12-20 04:44:41', '4485e768-c912-4a42-87d5-e9b0d71cec0f', 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('5c9a2bf9-f97f-4764-83f6-4b4d244ef231', 'A549754F8B17DE662144BC20F4403B44', '242768882471007@lid', 1, 'text', 'اه', NULL, 'sent', '2025-12-18 02:36:53', NULL, '2025-12-18 02:38:10', '2025-12-18 02:38:10', NULL, NULL, NULL, NULL),
('5dc38eaf-6923-4114-91e3-8ae172da6e7a', 'AC7FD2F35AA7AEC7A56C093B5C313E86', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:21:09', NULL, '2025-12-20 04:22:31', '2025-12-20 04:22:31', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('5edbbd2b-03e5-46c2-83a7-26189aa6352e', '2AA535E45C19D03D47C6', '120363403291850277@g.us', 0, 'text', 'اعمله ازاي مش المفروض هو الي يعمل', NULL, 'sent', '2025-12-18 10:57:57', NULL, '2025-12-18 10:59:17', '2025-12-18 10:59:17', NULL, '57324995641379@lid', 'Abdelrahman_altohami', NULL),
('648681c0-dd2f-4f4c-ae08-f04794525979', 'AC89712A9664AB4CC1A7227C780DF2A4', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:07', NULL, '2025-12-20 04:39:40', '2025-12-20 04:39:40', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('649abb9e-1f72-4f48-99b7-6a2f0edd929b', 'ACA81359CCFF88A2CF99FCAEB6E5E6E8', '120363365508284247@g.us', 0, 'reaction', 'reactionMessage', NULL, 'sent', '2025-12-18 08:08:26', NULL, '2025-12-18 08:58:58', '2025-12-18 08:58:58', NULL, NULL, NULL, NULL),
('64a8886c-37da-4666-b6fe-65b5516535b2', 'AC5CD8AAA56D2718488E06858EAE928A', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:31', NULL, '2025-12-20 04:39:54', '2025-12-20 04:39:54', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('65866069-8c98-460b-8893-2fc8d09e75c1', 'ACED8977BBD0C811C0BA94E7187CE862', '210994697654524@lid', 0, 'sticker', 'stickerMessage', NULL, 'sent', '2025-12-19 06:20:12', NULL, '2025-12-19 06:20:12', '2025-12-19 06:20:12', NULL, '210994697654524@lid', 'Shady Rasmy', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('65a9dafc-6b81-49d6-a6bb-ad37e5edd3b1', 'ACB6BFF38505C128DAB545929D482465', '120363399718987596@g.us', 0, 'senderKeyDistribution', 'اكونتات راجعه قيد (قديمه)\nبتستلم \n بالباسورد والايميل والباسورد والكوكيز والهويه \nاكونتات بصحتها تسد في اي شغل \nوفي اكونتات متشال منها ضريبه كمان', NULL, 'sent', '2025-12-19 14:45:17', NULL, '2025-12-19 14:45:18', '2025-12-19 14:45:18', NULL, '222230231404721@lid', 'Abdo ⚡️', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('68dc26c9-f412-4b80-b812-7cb096549eeb', 'AC4075F20E46D15E20B9ADBD551A1296', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:21:07', NULL, '2025-12-18 01:56:18', '2025-12-18 01:56:18', NULL, NULL, NULL, NULL),
('69b7adf4-060a-47da-9bbe-1200f833cdfc', 'AC8A1D55A8363768D97A9580410BF331', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:30:00', NULL, '2025-12-18 01:56:55', '2025-12-18 01:56:55', NULL, NULL, NULL, NULL),
('6b8a8ea6-f3c9-46a5-923a-466c363cd548', 'AC434A7AEBB704378B5D151AD83CF699', '201018441046-1630282106@g.us', 0, 'image', '📷 Image', 'https://mmg.whatsapp.net/o1/v/t24/f2/m233/AQNbHHu3bzbxgg9X7EYH-Kg76vRU3q0tbPCtGR-lCqxpKyr2Ciqj86kHDKBpQxQsYiIkuB6dw0XrWV6VwIoXAWDEsBdkekOTVWCfM-uJUw?ccb=9-4&oh=01_Q5Aa3QFCsp9Vrkj1o5zimvKVbtCaUzIyEOsPDnY7Y7Q7oQKOsg&oe=696A4C8B&_nc_sid=e6ed6c&mms3=true', 'sent', '2025-12-17 17:50:47', NULL, '2025-12-17 22:07:06', '2025-12-17 22:07:06', NULL, NULL, NULL, NULL),
('6e51de8d-b10b-46f1-8149-fbd8cabf1b59', 'ACBB64A0AC14DE868FF5196F1ECDCC8F', '120363403291850277@g.us', 0, 'text', 'https://www.facebook.com/share/p/1EY983sP6a/', NULL, 'sent', '2025-12-18 10:30:41', NULL, '2025-12-18 10:32:01', '2025-12-18 10:32:01', NULL, '184185713111249@lid', 'احمد مراد عيسى', NULL),
('6e86304d-f766-4e53-96ce-1bf115abf6f0', 'AC1AFB8903924525F1551AF659D27783', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'تاخد انجلش؟', NULL, 'sent', '2025-12-18 10:47:33', 'AC458D6CDBD2934525361D08CD5EABAD', '2025-12-18 10:48:50', '2025-12-18 10:48:50', NULL, '254365713613015@lid', 'mohamed roshdy', NULL),
('6f4326d5-d1a5-4082-9a06-334526040761', 'A550FC24BB8F7E2CDC9D5E7E609179C6', '120363317203633732@g.us', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 10:27:27', NULL, '2025-12-18 10:28:45', '2025-12-18 10:28:45', NULL, '218060136968399@lid', 'zad', NULL),
('70791f9a-6321-4c6b-8a45-2bd854692e8a', '3EB083BDF1D2DDE22F5110', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 11:12:52', NULL, '2025-12-18 11:12:55', '2025-12-18 11:12:55', NULL, 'me', 'Me', NULL),
('7139e0e0-7741-4ea0-8f63-74110831c08a', 'AC0520269F995406D70C87C931AB2FDA', '201014738598-1564967675@g.us', 0, 'audio', '🎤 Audio', 'http://localhost:3000/public/uploads/1766205556038-5589.ogg', 'sent', '2025-12-20 04:24:56', NULL, '2025-12-20 04:39:17', '2025-12-20 04:39:17', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('71e3e37a-3c29-4e00-8b53-721814c54639', 'AC3D7C677AC5BDB3DB73443605B278DC', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:24:54', NULL, '2025-12-20 04:39:06', '2025-12-20 04:39:06', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('72f261cf-5da1-4769-ac1d-a7af2e853287', '3EB07F6A8EE6692094D8EA', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-19 00:54:31', NULL, '2025-12-19 00:54:32', '2025-12-19 00:54:32', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('741d1cc3-2c1a-4c37-8289-c6d35e581ad9', 'ACE67EF97D16D620229769C0F19DC4E0', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:23:32', NULL, '2025-12-20 04:25:53', '2025-12-20 04:25:53', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('743899de-a469-4f9b-b27e-83a9f66210d0', '3EB02A61A4CEFB4DCEC845', '201273835923@s.whatsapp.net', 0, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 02:05:24', NULL, '2025-12-18 02:06:44', '2025-12-18 02:06:44', NULL, NULL, NULL, NULL),
('744beee0-5712-4e4b-b3ea-03299b983601', 'AC32135EAFB1C02E5A042DDDA56DE14C', '201014738598-1564967675@g.us', 0, 'audio', '🎤 Audio', 'http://localhost:3000/public/uploads/1766205554446-3266.ogg', 'sent', '2025-12-20 04:24:58', NULL, '2025-12-20 04:39:17', '2025-12-20 04:39:17', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('74b587ce-102c-4067-af8e-4b1d0d095028', 'AC742CDEC3724FCB843026A1C8372538', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:25:46', NULL, '2025-12-20 04:39:30', '2025-12-20 04:39:30', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('751fd17d-ae6b-4628-92fd-f93b9cdbc3c9', 'AC695CEC95F7CA6C1165A44FC7F98174', '120363365508284247@g.us', 0, 'text', 'ثواني كده عدم المؤاخذة', NULL, 'sent', '2025-12-18 03:20:49', '3EB0CEEEF8C3DBFA7844B7', '2025-12-18 08:58:44', '2025-12-18 08:58:44', NULL, NULL, NULL, NULL),
('77149552-5110-4b47-b0a6-9c37e9c3bda6', 'ACD5378A29AADAC7DE616ABE7D515257', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'إعادة تذكير لكل حد عليه أيام قضاء من رمضان ⚠️\n\nرمضان خلاص على الأبواب إن شاء الله، والوقت بيجري..\nودلوقتي النهار قصير، يعني ده كده وقت مثالي جدًا إنك لو عليك أيام قضاء تخلصها بفضل الله.', NULL, 'sent', '2025-12-18 11:03:35', NULL, '2025-12-18 11:04:53', '2025-12-18 11:04:53', NULL, '221109228142633@lid', 'Karem.R', NULL),
('786ef734-4f7d-4c8e-993b-5b8c9b0aaa00', 'A5B6783DFD0587C53A153D03F3805EAA', '120363421536577519@g.us', 0, 'senderKeyDistribution', '👍', NULL, 'sent', '2025-12-19 13:26:56', NULL, '2025-12-19 13:26:57', '2025-12-19 13:26:57', NULL, '9900503609415@lid', 'HDHPS', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('7add1c34-fd43-4dd3-a38a-ed0fbc0ad53a', 'ACA9DD32F6BCAB91412425C47B2B0F54', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'ابقا فكرني بيه لاحقا', NULL, 'sent', '2025-12-18 11:07:15', 'ACBB64A0AC14DE868FF5196F1ECDCC8F', '2025-12-18 11:09:02', '2025-12-18 11:09:02', NULL, '151707321426058@lid', 'Joey😎', NULL),
('7c266184-94ce-42ea-ab89-86cc10009c32', 'AC00E325DD9F01F849C3699F94699F88', '201018441046-1630282106@g.us', 0, 'text', '❤️‍🔥❤️‍🔥❤️‍🔥', NULL, 'sent', '2025-12-17 18:24:32', NULL, '2025-12-17 22:07:07', '2025-12-17 22:07:07', NULL, NULL, NULL, NULL),
('7cc5ecea-bef6-4e93-af01-6dffdf8afa00', 'AC1B524F4BE7B8DBAA3C77DCE4B8D17B', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:24:58', NULL, '2025-12-20 04:39:19', '2025-12-20 04:39:19', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('7d815a96-b4f4-4253-95b1-3c2aea85468a', 'A5077683BCA17A723D1836EA1714CEFC', '120363365508284247@g.us', 0, 'text', 'مالهوش ترخيص انت يعتبر بتسرق حقوق البث', NULL, 'sent', '2025-12-18 08:17:52', 'A549FB96B885662A1DDC06224A231257', '2025-12-18 08:59:02', '2025-12-18 08:59:02', NULL, NULL, NULL, NULL),
('8075a622-6032-4fda-9f40-1275fcb402e7', 'ACAA9DADD5E386517BC1F52E5049980D', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:28:22', NULL, '2025-12-20 04:40:09', '2025-12-20 04:40:09', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('812f193d-3177-4069-b9b3-ebb465d9ecfb', 'A530FE4EAACEF0C9669F2D3853A4C537', '120363317203633732@g.us', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 10:28:16', NULL, '2025-12-18 10:29:35', '2025-12-18 10:29:35', NULL, '218060136968399@lid', 'zad', NULL),
('81613c91-432b-429e-b434-765c3fcd7105', 'ACB26FCF640EEA28881C2C2EAC6EA03A', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'اعمل انت له وخذ اكسس', NULL, 'sent', '2025-12-18 10:56:55', '2A8DBC062F21744FDB99', '2025-12-18 10:58:49', '2025-12-18 10:58:49', NULL, '194686723616922@lid', 'Dr.Bob', NULL),
('816290fc-155c-45d6-8b63-337ac19dca9a', 'A50BC3D6FE05D8DF0100A3976B5FB8A5', '120363365508284247@g.us', 0, 'reaction', 'reactionMessage', NULL, 'sent', '2025-12-18 08:19:46', NULL, '2025-12-18 08:59:03', '2025-12-18 08:59:03', NULL, NULL, NULL, NULL),
('81d2e3a7-7319-4f98-a99e-6fc297d3ebff', 'A5305671233404D9F924A3D4C73CCA1A', '209787845398651@lid', 0, 'text', 'دايما', NULL, 'sent', '2025-12-20 04:43:09', '3EB09295CA7171AFF1B9BA', '2025-12-20 04:44:25', '2025-12-20 04:44:25', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '209787845398651@lid', 'Marketing', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('82be583a-9cef-4dd7-ac3c-fd144cbb0830', 'ACBC6FF39709A34016A64632D5BEF2F1', '120363403291850277@g.us', 0, 'reaction', '❤️', NULL, 'sent', '2025-12-18 10:52:09', NULL, '2025-12-18 10:53:31', '2025-12-18 10:53:31', NULL, '254365713613015@lid', 'mohamed roshdy', NULL),
('8409912f-9dbd-4b39-a786-4256aec86724', '3EB0C113E04D5928E75D55', '201001742924@s.whatsapp.net', 1, 'text', 'jkhk', NULL, 'sent', '2025-12-19 12:25:00', NULL, '2025-12-19 12:25:00', '2025-12-19 12:25:00', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('845c5ea0-f445-4dea-a9d7-8f9dcb122e2b', 'AC6579CE8C9743B5D9A1141AF466F726', '120363365508284247@g.us', 0, 'text', 'في  بلجن اسمه:\nCountry State City Selector\n​بيديلك Shortcode تحطه  في أي صفحة، ويظهر لحضرتك 3 قوائم (دولة، ثم ولاية، ثم مدينة) مرتبطين ببعض تلقائياً.\n​الكلام دا إذا كان ووردبريس', NULL, 'sent', '2025-12-18 07:17:22', 'A5D570A2BA529BA532C849D44B7438A5', '2025-12-18 08:58:52', '2025-12-18 08:58:52', NULL, NULL, NULL, NULL),
('85d0a394-10b8-4981-bcb8-d26388536463', 'AC485B27C9E0E084799ACC4211ECF1AB', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:05', NULL, '2025-12-20 04:39:35', '2025-12-20 04:39:35', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('880a51f2-07ce-45b5-a595-6d353c3a0a1e', 'AC64DBDEFC78FF881F33C10097FDA16B', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:21:19', NULL, '2025-12-20 04:22:44', '2025-12-20 04:22:44', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('8876d4f4-af0f-437c-962c-c310c37e1cc2', 'ACF43AE974F369258DF89688CAD75CCA', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:20:12', NULL, '2025-12-18 01:56:16', '2025-12-18 01:56:16', NULL, NULL, NULL, NULL),
('8a204ff4-fd2b-4474-9fcd-c9fa69560bf0', '3EB0C889CCCB77D8871342', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-19 00:53:56', NULL, '2025-12-19 00:53:57', '2025-12-19 00:53:57', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('8b499a54-aaad-45c3-aab7-474d7502c988', 'A55A7A29F0A7B7D8C56B119BFDA3BC43', '209787845398651@lid', 0, 'text', 'تمام', NULL, 'sent', '2025-12-20 05:13:30', NULL, '2025-12-20 05:14:47', '2025-12-20 05:14:47', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '209787845398651@lid', 'Marketing', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('8d40fb7c-b14d-467f-b3b0-2a361a726dbb', 'AC241A3BE9815AC72E40620B5E9A7D08', '210994697654524@lid', 0, 'sticker', 'stickerMessage', NULL, 'sent', '2025-12-19 06:20:09', NULL, '2025-12-19 06:20:09', '2025-12-19 06:20:09', NULL, '210994697654524@lid', 'Shady Rasmy', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('8dd1568d-deb0-465e-aa25-024fda876b37', 'ACB5EB05D10733C3C47F1D68DC9EA144', '201014738598-1564967675@g.us', 0, 'audio', '🎤 Audio', 'http://localhost:3000/public/uploads/1766205567509-8671.ogg', 'sent', '2025-12-20 04:25:01', NULL, '2025-12-20 04:39:27', '2025-12-20 04:39:27', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('8fd8edb1-6872-4746-a048-369847dac144', '3EB0C7A97D6C1D079A57CF', '201001742924@s.whatsapp.net', 0, 'text', 'ok', NULL, 'sent', '2025-12-18 02:07:32', NULL, '2025-12-18 02:08:52', '2025-12-18 02:08:52', NULL, NULL, NULL, NULL),
('92c43497-1e70-4d5c-894d-19446423e321', 'AC87705C7C444228064E1E53B8C05D13', '201018441046-1630282106@g.us', 0, 'image', '📷 Image', 'https://mmg.whatsapp.net/o1/v/t24/f2/m231/AQMsaK6A2r25FsMVPP8M20ECAAXslA8ED_MH6-mQ_GBbFVwFpNQelbYiTqEXI9lmu22_kyyV_2-nddFd0BXbZaoNireC2K6FQB4HUZRVCg?ccb=9-4&oh=01_Q5Aa3QHsd2x5eBUy9TPuAySh9loPzWHaHoPP6sQE8_odWfxIQw&oe=696A7105&_nc_sid=e6ed6c&mms3=true', 'sent', '2025-12-17 17:50:47', NULL, '2025-12-17 22:07:05', '2025-12-17 22:07:05', NULL, NULL, NULL, NULL),
('93011d46-be21-45e0-a519-59426a513ef8', 'AC9630611083F06EBDBBA6AC9AA9F635', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:31:20', NULL, '2025-12-18 01:57:00', '2025-12-18 01:57:00', NULL, NULL, NULL, NULL),
('9420e004-63b8-4673-86d9-1918c9227ddd', 'AC80DF3C10F8E9C986175D0E4C180412', '210994697654524@lid', 0, 'sticker', 'stickerMessage', NULL, 'sent', '2025-12-19 06:20:02', NULL, '2025-12-19 06:20:02', '2025-12-19 06:20:02', NULL, '210994697654524@lid', 'Shady Rasmy', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('943847ce-0168-440e-9094-993473493dd4', '3EB0A764772B2AC01B63F5', '120363365508284247@g.us', 0, 'text', 'بيعتبروها تسيِيل أو غسيل أموال وبيجولهم عليها fraud payments و recharge back كتير', NULL, 'sent', '2025-12-18 03:18:29', NULL, '2025-12-18 08:58:44', '2025-12-18 08:58:44', NULL, NULL, NULL, NULL),
('9517738c-eede-4497-aebb-285806cd16de', 'A59C63AD00824853801C8057F4F14780', '120363317203633732@g.us', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 10:27:54', NULL, '2025-12-18 10:29:12', '2025-12-18 10:29:12', NULL, '218060136968399@lid', 'zad', NULL),
('953c63ad-8d40-4a08-ab8e-11ad3bf20c73', 'A528FB59EAA9BF0C07AA97077D7F02C3', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:51:16', NULL, '2025-12-19 00:51:17', '2025-12-19 00:51:17', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('958406ea-1bd5-4916-b1cb-acc489832cd2', 'ACACCA3BDC03E5D2667CD671613D1926', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:24:22', NULL, '2025-12-20 04:39:02', '2025-12-20 04:39:02', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('96674548-f0bb-4982-b961-0f534efa94b8', '66BE47720E72E15C75CB33F6CDFED0C2', '242768882471007@lid', 0, 'audio', '🎤 Audio', 'http://localhost:3000/public/uploads/1766024418678-2270.ogg', 'sent', '2025-12-18 02:19:00', NULL, '2025-12-18 02:20:21', '2025-12-18 02:20:21', NULL, NULL, NULL, NULL),
('97bff289-2a90-4b98-8b0b-86c6387acc56', 'ACE3F1B751C45F1E74C01FFD7FC207FF', '201014738598-1564967675@g.us', 0, 'senderKeyDistribution', '131_ جيش من المشاعر', NULL, 'sent', '2025-12-20 04:24:46', NULL, '2025-12-20 04:39:05', '2025-12-20 04:39:05', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('98255f6b-1a6f-4986-957c-f4faf854a970', 'A51DA9B817C9458E7A736575B8D93053', '209787845398651@lid', 0, 'text', 'Hello back', NULL, 'sent', '2025-12-20 04:42:00', NULL, '2025-12-20 04:43:17', '2025-12-20 04:43:17', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '209787845398651@lid', 'Marketing', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('9838778a-f2dd-4c68-9686-f7ea219c4536', 'A57FB4AAB68C1DE07D6D9CE1FF036DDE', '120363365508284247@g.us', 0, 'text', 'فهمت', NULL, 'sent', '2025-12-18 08:19:35', 'A57F4076640CA0C1900E68FAD170FF30', '2025-12-18 08:59:03', '2025-12-18 08:59:03', NULL, NULL, NULL, NULL),
('98cfcdc3-a4c8-4989-a4a4-55584de40697', 'A5C78028C3E830B99E44527550DD4640', '120363391562841494@g.us', 0, 'image', '📷 Image', 'http://localhost:3000/public/uploads/1766056153585-4802.jpg', 'sent', '2025-12-18 11:07:55', NULL, '2025-12-18 11:09:13', '2025-12-18 11:09:13', NULL, '229170982420646@lid', 'Mohamed Abuelela', NULL),
('99ab0480-d9f3-4410-8747-e6c04063c33e', 'A5634DADBE56FF6BD89B34016B700711', '120363317203633732@g.us', 0, 'senderKeyDistribution', 'دافع ب محفظة من نصايه شغال', NULL, 'sent', '2025-12-18 10:20:42', 'ACFA97B2CCB72A4A21ADD5F50078318C', '2025-12-18 10:22:10', '2025-12-18 10:22:10', NULL, '142446969274381@lid', 'Ahmed', NULL),
('9b38723f-d166-4d99-ae72-4ff6f2ba494f', '3EB0B3DFB8CF3EF5927ECE', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-18 11:15:28', NULL, '2025-12-18 11:15:30', '2025-12-18 11:15:30', NULL, 'me', 'Me', NULL),
('9c1781a8-52fd-4f4e-b73b-a33875eff567', 'ACC1654D6DD9D229D2163267C85FD4E6', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:31:50', NULL, '2025-12-20 04:40:17', '2025-12-20 04:40:17', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('9cfcc77e-25b9-432c-83e7-b74c8bd828cc', 'ACB9C2AD85CA79AF2E3DEC6D74B15435', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:26:15', NULL, '2025-12-20 04:39:31', '2025-12-20 04:39:31', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('9ff6a585-ccac-47a6-a2d5-3ad1cef6e8ba', '3EB06CFCDC22AB3D08BBD7', '201001742924@s.whatsapp.net', 1, 'text', 'hello', NULL, 'sent', '2025-12-19 12:24:49', NULL, '2025-12-19 12:24:49', '2025-12-19 12:24:49', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('9ffcb138-b70a-4880-b4b7-1857374e037f', 'AC76509D42844A0B7FF35B7BB1F81FAC', 'status@broadcast', 0, 'image', '📷 Image', 'http://localhost:3000/public/uploads/1766048335167-7493.jpg', 'sent', '2025-12-18 07:53:15', NULL, '2025-12-18 08:58:55', '2025-12-18 08:58:55', NULL, NULL, NULL, NULL),
('a1bd2ce1-a0b6-45d8-852d-7cd236ab9d07', 'A57F4076640CA0C1900E68FAD170FF30', '120363365508284247@g.us', 0, 'text', 'زى موقع ايجي بيست كان بيتقفل بسبب كده', NULL, 'sent', '2025-12-18 08:18:22', NULL, '2025-12-18 08:59:02', '2025-12-18 08:59:02', NULL, NULL, NULL, NULL),
('a2eeb1a1-66ea-4149-aa4f-1ca7367ff57e', '3A99DC36A98ABC725872', '120363365508284247@g.us', 0, 'text', 'ايوه تماماً', NULL, 'sent', '2025-12-18 03:11:41', 'AC203EBF49EA147FFA3D48C4B2A1D1EA', '2025-12-18 08:58:40', '2025-12-18 08:58:40', NULL, NULL, NULL, NULL),
('a4605d1c-bd84-4185-82ae-4003ae8cf17a', '3EB082E5213E4561A56D8A', '201006348127@s.whatsapp.net', 0, 'text', 'ممكن اعمل دارك فيس وانستا', NULL, 'sent', '2025-12-18 09:57:42', NULL, '2025-12-18 10:08:13', '2025-12-18 10:08:13', NULL, '201006348127@s.whatsapp.net', 'علاء فايد', NULL),
('a47e21ed-04c9-47fa-be87-6a7f5cb0a50d', '3EB07B28F5FC65F8F0B695', '201001742924@s.whatsapp.net', 1, 'text', 'ok', NULL, 'sent', '2025-12-19 03:09:01', NULL, '2025-12-19 03:09:02', '2025-12-19 03:09:02', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('a4d18a34-2142-44bf-9dc1-25c2f6896638', 'A589E0DE31DF918FE94F177A45BBC812', '242768882471007@lid', 1, 'text', 'تمام نجدد علي عاديه ولما تاني يخلص ان شاء الله', NULL, 'sent', '2025-12-18 02:21:24', NULL, '2025-12-18 02:22:41', '2025-12-18 02:22:41', NULL, NULL, NULL, NULL),
('a8339ead-e7c9-498a-b8e5-e909584d1268', 'AC0CB24A2131A2801DC466304BE51168', '120363365508284247@g.us', 0, 'text', 'Why?', NULL, 'sent', '2025-12-18 03:17:50', '3EB08448A6A9011D0FB865', '2025-12-18 08:58:43', '2025-12-18 08:58:43', NULL, NULL, NULL, NULL),
('a894414d-4f0e-42d8-be68-8027f0f62dbf', 'ACBDEBBE5498D6A47D18CF5CA302A1FB', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'السلام عليكم', NULL, 'sent', '2025-12-18 10:29:08', NULL, '2025-12-18 10:30:27', '2025-12-18 10:30:27', NULL, '184185713111249@lid', 'احمد مراد عيسى', NULL),
('aae2e730-2824-41df-a47d-831d595e8ac9', 'ACDB9F1C648831DFB0EE7B33EDC6FA62', '201014738598-1564967675@g.us', 0, 'text', '135_  السابع عشر من رمضان من السنة الثانية للهجرة', NULL, 'sent', '2025-12-20 04:24:55', NULL, '2025-12-20 04:39:08', '2025-12-20 04:39:08', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('ab09d6e7-3f94-464e-bbd6-d7da5a47a351', 'AC82BD27B8E7A31FF0957BDCBF09FF3E', '120363403291850277@g.us', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 10:30:34', NULL, '2025-12-18 10:31:52', '2025-12-18 10:31:52', NULL, '184185713111249@lid', 'احمد مراد عيسى', NULL),
('ab5702ae-b1ef-41ba-b384-ea915da2f7e5', '3EB08448A6A9011D0FB865', '120363365508284247@g.us', 0, 'text', 'عموما كل دا ممنوع في مصر', NULL, 'sent', '2025-12-18 03:17:33', NULL, '2025-12-18 08:58:42', '2025-12-18 08:58:42', NULL, NULL, NULL, NULL),
('ac1acfe6-a6a1-4a7d-bfb7-d559a7b7f6a2', 'AC147EB42E85BA51DF1558AE410C9945', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:22:41', NULL, '2025-12-20 04:24:29', '2025-12-20 04:24:29', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db');
INSERT INTO `messages` (`id`, `message_id`, `jid`, `from_me`, `type`, `content`, `media_url`, `status`, `timestamp`, `quoted_message_id`, `createdAt`, `updatedAt`, `instance_id`, `sender_jid`, `sender_name`, `user_id`) VALUES
('ae7be992-551a-46e0-9cfd-25b36be757ad', 'ACC77ED0A084F793F9995E3DE6970296', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:27:17', NULL, '2025-12-18 01:56:41', '2025-12-18 01:56:41', NULL, NULL, NULL, NULL),
('aeab6521-c249-4db4-9e17-046a5321f529', 'AC1EE56ED72E4C836FC950CE87FD7F16', '120363403291850277@g.us', 0, 'text', 'من فترة كنا بنتكلم عن ليه الاعلانات الممولة مش بتنجح واتكلمنا عن الإعلان في ذاته مش بينجَّح بل المحتوى القوي والقيم\n\nفعملت منشور من كام عن ال organic growth marketing \n\nوحبيت أشاركه معاكم 👇🏻', NULL, 'sent', '2025-12-18 10:29:53', NULL, '2025-12-18 10:31:11', '2025-12-18 10:31:11', NULL, '184185713111249@lid', 'احمد مراد عيسى', NULL),
('aee362bb-ccf6-4965-a9e7-9e229e0eb123', 'A5C197E648131FF086D7431B95ADF152', '210994697654524@lid', 1, 'text', 'هاي', NULL, 'sent', '2025-12-17 07:01:18', NULL, '2025-12-17 07:02:34', '2025-12-17 07:02:34', NULL, NULL, NULL, NULL),
('b039ceb6-244c-45d5-ab63-a71ddc516bf9', '3EB0DBB63996D400D68F13', '120363365508284247@g.us', 0, 'reaction', 'reactionMessage', NULL, 'sent', '2025-12-18 03:17:36', NULL, '2025-12-18 08:58:43', '2025-12-18 08:58:43', NULL, NULL, NULL, NULL),
('b0a26949-709b-4c21-8e47-79666ddb39af', 'AC29FED47FFB77F50041D06FD727BFAA', '43598481477887@lid', 1, 'text', 'تعمله من ادز مانجر عادي', NULL, 'sent', '2025-12-18 10:00:11', NULL, '2025-12-18 10:08:16', '2025-12-18 10:08:16', NULL, 'me', 'Me', NULL),
('b257103a-778c-4094-880a-ea006f826bca', 'ACA459A97D13892C2ACD6BDC8B7A7EBF', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:18:06', NULL, '2025-12-18 01:56:07', '2025-12-18 01:56:07', NULL, NULL, NULL, NULL),
('b3496e9c-375c-447f-9681-f29d8e25942d', 'AC8E890BAB5A8EF2844824412B678A37', '120363365508284247@g.us', 0, 'text', 'يعني لو مجالك فيه مشكلة هما بيشتغلو فيه وكان اغلبهم روس وهنود', NULL, 'sent', '2025-12-18 04:43:07', NULL, '2025-12-18 08:58:46', '2025-12-18 08:58:46', NULL, NULL, NULL, NULL),
('b5b57824-dfc5-46cc-b39f-435d5361b1bc', 'A5B9F0F46946716C21BA3FC963CD44BC', '120363317203633732@g.us', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 10:28:28', NULL, '2025-12-18 10:29:49', '2025-12-18 10:29:49', NULL, '218060136968399@lid', 'zad', NULL),
('b6306a76-4886-4855-81a4-c4ae351d1946', 'AC7E47D2E7C244981D18FF508C9F1898', '120363365508284247@g.us', 0, 'text', 'امال اي المسموح...؟🙂', NULL, 'sent', '2025-12-18 03:20:56', NULL, '2025-12-18 08:58:45', '2025-12-18 08:58:45', NULL, NULL, NULL, NULL),
('b64adc17-28ca-487b-9256-0ac2f5a2ea40', '3EB0C889CCCB77D8871342', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-19 00:53:56', NULL, '2025-12-19 00:53:57', '2025-12-19 00:53:57', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('b686a38c-d100-4874-8ca0-b191f1498189', '3EB00A42FA189C0126EB29', '120363365508284247@g.us', 0, 'text', 'اسمها ديجيتال يا صاحبي', NULL, 'sent', '2025-12-18 03:17:23', '3AF7F8A51D8456E09ED6', '2025-12-18 08:58:42', '2025-12-18 08:58:42', NULL, NULL, NULL, NULL),
('b837d423-0058-4442-b733-a6922c7ff1d2', 'DE7E9AB28341506D344DC08F56D6312F', '242768882471007@lid', 0, 'text', 'باذن الله', NULL, 'sent', '2025-12-18 03:07:38', NULL, '2025-12-18 08:58:21', '2025-12-18 08:58:21', NULL, NULL, NULL, NULL),
('b8af31c7-dd09-450c-a572-1e247134c0af', 'ACDA8261CF89D0E142B1CBD629D26949', '201014738598-1564967675@g.us', 0, 'audio', '🎤 Audio', 'http://localhost:3000/public/uploads/1766205563503-712.ogg', 'sent', '2025-12-20 04:25:00', NULL, '2025-12-20 04:39:23', '2025-12-20 04:39:23', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('b92a151a-9a00-4da3-bc00-e00a24a8734e', '3EB083BDF1D2DDE22F5110', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from WaMate API! 🚀', NULL, 'sent', '2025-12-18 11:12:52', NULL, '2025-12-18 11:12:54', '2025-12-18 11:12:54', NULL, 'me', 'Me', NULL),
('b997f282-3f59-499a-9da5-d4f7831377c7', '1E2130C00EC8EA4BD49C0CCF7EB9A3B9', '242768882471007@lid', 0, 'image', '📷 Image', 'http://localhost:3000/public/uploads/1766048302618-6507.jpg', 'sent', '2025-12-18 03:50:26', NULL, '2025-12-18 08:58:22', '2025-12-18 08:58:22', NULL, NULL, NULL, NULL),
('b9af84d7-73a1-46bb-992d-88eb4b698526', 'AC78BBF57EF47735AB7EC121AC05AD9A', '120363365508284247@g.us', 0, 'reaction', 'reactionMessage', NULL, 'sent', '2025-12-18 07:59:43', NULL, '2025-12-18 08:58:57', '2025-12-18 08:58:57', NULL, NULL, NULL, NULL),
('bb39df09-051a-4ed2-9ffd-e20849621cdb', 'ACDB444A4BD98D64B0173F5A08BF995F', '120363365508284247@g.us', 0, 'text', 'صلاة الفجر ي شباب ♥️', NULL, 'sent', '2025-12-18 03:12:09', NULL, '2025-12-18 08:58:41', '2025-12-18 08:58:41', NULL, NULL, NULL, NULL),
('bbdccdb0-7afc-4b2a-8af7-6a5076a89f65', 'ACFC5DFC3FF6E6BD68A6D52C7EC60188', '201014738598-1564967675@g.us', 0, 'text', '132_ هل انتهت المهمة ؟', NULL, 'sent', '2025-12-20 04:24:47', NULL, '2025-12-20 04:39:06', '2025-12-20 04:39:06', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('bc87bfff-6094-40ad-b2cd-9d4539a6e4fd', '3EB0B3DFB8CF3EF5927ECE', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-18 11:15:28', NULL, '2025-12-18 11:15:30', '2025-12-18 11:15:30', NULL, 'me', 'Me', NULL),
('bd9a9ef7-9ae9-4e5e-bf29-c84c359f0c7d', 'ACA1CBCBA997356F62FCAB600FA9CB15', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:29:06', NULL, '2025-12-20 04:40:10', '2025-12-20 04:40:10', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('be0bb052-9d90-4f88-a603-877e88f4bea1', 'ACAA5C37ABEA7111D4F5E4AD4A6EB4F3', '120363403291850277@g.us', 0, 'text', 'انا مش حاطو', NULL, 'sent', '2025-12-18 06:18:56', 'AC477A38E19FD6E2BD15B3FB66F4BF29', '2025-12-18 08:58:49', '2025-12-18 08:58:49', NULL, NULL, NULL, NULL),
('be760477-be0f-4835-816c-242a850add6c', 'AC992DB017577017314BFE7F8A8F3D5C', '210994697654524@lid', 0, 'text', 'ازيك', NULL, 'sent', '2025-12-19 06:19:54', NULL, '2025-12-19 06:19:54', '2025-12-19 06:19:54', NULL, '210994697654524@lid', 'Shady Rasmy', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('c10c4033-9d7f-4ec0-98be-3571b1ced8cf', 'ACFA9C3CA97CF7D429906B48C0E62D6A', '120363403291850277@g.us', 0, 'text', 'تسلم ♥️', NULL, 'sent', '2025-12-18 10:51:32', 'AC1C6B1F59D6ED44BEA23AE5952E14C9', '2025-12-18 10:52:49', '2025-12-18 10:52:49', NULL, '229149557964900@lid', 'AHMED RAMADAN', NULL),
('c1e83999-3d3f-4563-8e04-3989e1159549', '2A8DBC062F21744FDB99', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'يشباب لو عميل معملش اعلانات قبل كدا و معندوش بيزنس مانيجر اعمل معاه اي', NULL, 'sent', '2025-12-18 10:55:42', NULL, '2025-12-18 10:57:02', '2025-12-18 10:57:02', NULL, '57324995641379@lid', 'Abdelrahman_altohami', NULL),
('c46a1813-2c39-472d-8eb5-ed57aebf001c', 'ACA5DAEDB4EF6FB9A98C86C7D5FC2AC8', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:08', NULL, '2025-12-20 04:39:46', '2025-12-20 04:39:46', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('c6cca6a8-edb0-417a-8066-daae2a493d2c', '3EB0B3DFB8CF3EF5927ECE', '201273835923@s.whatsapp.net', 0, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-18 11:14:14', NULL, '2025-12-18 11:15:31', '2025-12-18 11:15:31', NULL, '201273835923@s.whatsapp.net', 'Marketing', NULL),
('c6d3027b-0bdc-4121-90e0-662fc20b037f', '3EB0C113E04D5928E75D55', '201001742924@s.whatsapp.net', 1, 'text', 'jkhk', NULL, 'sent', '2025-12-19 12:25:00', NULL, '2025-12-19 12:25:00', '2025-12-19 12:25:00', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('c6d4e1bc-b549-42dc-a8ee-597bdf18d249', 'A5F9602E9D0DB25338D40885F21899DF', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:25', NULL, '2025-12-18 23:21:26', '2025-12-18 23:21:26', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('c6f6aa0d-2d69-46a1-8290-16fe203bb632', 'ACC565008227C64B46FF9BA9BE10B1A7', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:23:05', NULL, '2025-12-20 04:24:36', '2025-12-20 04:24:36', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('c70a1827-8808-4c29-926e-da992a565eea', 'AC74055D970220B9EDE64D66B9DD8633', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:32:01', NULL, '2025-12-20 04:40:24', '2025-12-20 04:40:24', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('c78aaf34-d632-44fc-ba5b-8e63df718433', 'AC1C6B1F59D6ED44BEA23AE5952E14C9', '120363403291850277@g.us', 0, 'text', 'https://www.youtube.com/live/PR-4ziE_30k?si=x_qbWszlPtjw83U8\nشوف ده هيفيدك باذن الله', NULL, 'sent', '2025-12-18 10:51:11', NULL, '2025-12-18 10:52:30', '2025-12-18 10:52:30', NULL, '254365713613015@lid', 'mohamed roshdy', NULL),
('c82315d0-e2df-422b-8ba3-21a4ecdab049', 'A53248898ECFAADFFA849AD1E459A4B0', '120363365508284247@g.us', 0, 'text', '@57209534840862 ده رقمي الثاني', NULL, 'sent', '2025-12-18 08:16:26', NULL, '2025-12-18 08:59:00', '2025-12-18 08:59:00', NULL, NULL, NULL, NULL),
('c90f808a-e708-467a-93e6-74f90876728b', 'A549FB96B885662A1DDC06224A231257', '120363365508284247@g.us', 0, 'text', 'مش مرخص لي..؟\n\nولا ازاي', NULL, 'sent', '2025-12-18 08:16:57', 'AC9287C6D86B713A3112D0478E7BFCE1', '2025-12-18 08:59:01', '2025-12-18 08:59:01', NULL, NULL, NULL, NULL),
('cafe586b-fb4f-4e48-ac10-6662abea1f5d', 'ACA280833602006CAC530CF8CE466153', '201018441046-1630282106@g.us', 0, 'image', '📷 Image', 'https://mmg.whatsapp.net/o1/v/t24/f2/m232/AQMNHOB-R9suUjkQXNo2H9O5PwffNhPn2BRBHzLi0c9Sko7oAhBNZCWqTVtyeVyJwPkiSTMVNY9oC4uwqnWT62S3h5lOlndUWCGctotS8Q?ccb=9-4&oh=01_Q5Aa3QELqB64XOPd5-wQ2rVKPXkyWFq9niyrut1AV73cFioWsw&oe=696A5383&_nc_sid=e6ed6c&mms3=true', 'sent', '2025-12-17 17:50:48', NULL, '2025-12-17 22:07:06', '2025-12-17 22:07:06', NULL, NULL, NULL, NULL),
('cbb17cf8-e8ef-4042-8377-e95091ecd2dd', 'A544DD90A248A76C6DF0133F03C2D84E', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:51:00', NULL, '2025-12-19 00:51:00', '2025-12-19 00:51:00', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('cca8bee5-0666-4c6f-9c8e-cf9a5af8f358', 'ACA2A5184E2E38351A484A1549B73F40', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:28:05', NULL, '2025-12-20 04:40:06', '2025-12-20 04:40:06', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('ce1f10d5-d69f-4d6c-a551-e785edadd71d', '3EB0FD9801DC8DF50D33D1', '201006348127@s.whatsapp.net', 0, 'text', 'وكونفرجرن واتس مش ماسنجر', NULL, 'sent', '2025-12-18 09:57:47', NULL, '2025-12-18 10:08:15', '2025-12-18 10:08:15', NULL, '201006348127@s.whatsapp.net', 'علاء فايد', NULL),
('cf040168-a204-4ac0-ab4e-0343c795682b', '3EB09B94CC55DC7AB15F9D', '120363403291850277@g.us', 0, 'senderKeyDistribution', 'تعمله اكونت جديد بكل حاجة', NULL, 'sent', '2025-12-18 10:56:13', '2A8DBC062F21744FDB99', '2025-12-18 10:57:34', '2025-12-18 10:57:34', NULL, '21728793256023@lid', 'baselmetwally', NULL),
('cffdc808-dfc0-4445-845e-b9fd82738bf1', '3F01918E3D0164D5DA4112FEB0228BCB', '242768882471007@lid', 0, 'text', 'لو مناسب معاك', NULL, 'sent', '2025-12-18 02:19:19', NULL, '2025-12-18 02:20:37', '2025-12-18 02:20:37', NULL, NULL, NULL, NULL),
('d181cb8f-c99c-4598-b0c6-28ca84bf8dd8', 'ACB7DD9CBA5398BF51C8E0C0DDA6FF90', '201018441046-1630282106@g.us', 0, 'image', '📷 Image', 'https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQO1J0f05B-z5vHr7m3L-5atsfLRZOF6hVa3JrvrXQPR5WZaEozCTUSyNQ_gx407CNxBOVtovNM3oL_iEc_c4DcCSj6evp54MMsPQFtuNg?ccb=9-4&oh=01_Q5Aa3QHJgCc0xtRiSwlmYuQNZZwZ04euYLlkj1tbsxrYK2xCpQ&oe=696A694A&_nc_sid=e6ed6c&mms3=true', 'sent', '2025-12-17 17:50:46', NULL, '2025-12-17 22:07:02', '2025-12-17 22:07:02', NULL, NULL, NULL, NULL),
('d1e3e57e-07e5-492d-be01-d08b6b7fd07a', '70F6C5CB68982DBB0D604C56739BB3CD', '242768882471007@lid', 0, 'text', '..', NULL, 'sent', '2025-12-18 02:36:40', 'A5BE045B20E3222041591336EF829E37', '2025-12-18 02:37:59', '2025-12-18 02:37:59', NULL, NULL, NULL, NULL),
('d4f931ed-1b92-4350-9dc8-6235b6874335', 'A563B153ECF9388B17A351FCEBDB53FC', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:50:40', NULL, '2025-12-19 00:50:42', '2025-12-19 00:50:42', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('d525da5b-212c-4dea-b49f-563dac9deec2', '73BB74F1A637C362A8BA315FBCED2A92', '242768882471007@lid', 0, 'text', 'تمام يا مدير', NULL, 'sent', '2025-12-18 03:07:46', NULL, '2025-12-18 08:58:22', '2025-12-18 08:58:22', NULL, NULL, NULL, NULL),
('d534a962-d914-418a-8e67-c4b466293151', '102787EF991463B04672C71082C52CEB', '242768882471007@lid', 0, 'text', 'لسه', NULL, 'sent', '2025-12-18 03:50:35', 'A53EF7EDB10E97A6BA9F43F15F72C935', '2025-12-18 08:58:23', '2025-12-18 08:58:23', NULL, NULL, NULL, NULL),
('d75c0104-4d31-4e2f-b408-d3f23153d5c6', '3A18BAECC238160EBC83', '120363403291850277@g.us', 0, 'text', 'دة موجود فالويندوز نفسه', NULL, 'sent', '2025-12-18 07:56:01', NULL, '2025-12-18 08:58:57', '2025-12-18 08:58:57', NULL, NULL, NULL, NULL),
('da4e2a73-7ec6-461d-af58-33a1497b41d3', '3EB0C650D93C80204A78F3', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-19 00:56:22', NULL, '2025-12-19 00:56:23', '2025-12-19 00:56:23', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('db53139d-e619-4778-b037-d96f3458acb2', 'AC7D21CF7D42AA4A2642178A3AEBB605', '120363403291850277@g.us', 0, 'text', 'اعمله حفظ', NULL, 'sent', '2025-12-18 11:16:12', 'ACA9DD32F6BCAB91412425C47B2B0F54', '2025-12-18 11:17:30', '2025-12-18 11:17:30', NULL, '184185713111249@lid', 'احمد مراد عيسى', NULL),
('dbd85ad2-f6e6-4aca-b7e7-917968c68f9d', '3EB0A0F7CBAF7638C86282', '120363421536577519@g.us', 0, 'senderKeyDistribution', 'We are excited to announce that YOUSMIND AI Apps v4.2 is now officially released.\nThis update focuses on massive performance improvements, multilingual expansion, and advanced voice & subtitle systems.\n\nWHAT’S NEW IN v4.2\n\nMassive Rendering Speed Upgrade\nRendering speed is now up to 20x faster compared to previous versions.\nOptimized pipeline ensures smoother, quicker, and more stable video generation.\nMultilingual Video Creation Support\nMultilingual video creation is now fully supported.\n60+ languages have been added, enabling global content creation like never before.\nNew Voice Providers Added\nWe have expanded voice options significantly:\n\nGoogle Voice\nFree and unlimited usage\nTotal new voices added: 1,971\n\nElevenLabs\nUsers can now use their own ElevenLabs API keys for premium-quality voices.\n\nMicrosoft Voice\nExisting Microsoft voice support remains available and fully supported.\nSubtitle Generation System – Fully Upgraded\n\nOld subtitle system was limited and supported only English.\nNew subtitle system supports multilingual subtitles.\nPerformance improved up to 90x faster than the old system.\n\nUsers can still choose between:\nOld subtitle system\nNew subtitle system\n(Both systems are supported for flexibility.)\n\nUpcoming Feature Notice\n\nVeo 3.1 Extend will be introduced in v4.3 (upcoming version).\nDue to high user demand, v4.2 was launched early to deliver performance upgrades faster.\nAs a result, Veo 3.1 was not included in this release.\n\nSUPPORTED LANGUAGES (60+)\nArabic, Basque (Spain), Bengali (India), Bulgarian (Bulgaria), Catalan (Spain), Chinese (Hong Kong), Croatian (Croatia), Czech (Czech Republic), Danish (Denmark), Dutch (Belgium), Dutch (Netherlands), English (Australia), English (India), English (UK), English (US), Estonian (Estonia), Filipino (Philippines), Finnish (Finland), French (Canada), French (France), Galician (Spain), German (Germany), Greek (Greece), Gujarati (India), Hebrew (Israel), Hindi (India), Hungarian (Hungary), Icelandic (Iceland), Indonesian (Indonesia), Italian (Italy), Japanese (Japan), Kannada (India), Korean (South Korea), Latvian (Latvia), Lithuanian (Lithuania), Malay (Malaysia), Malayalam (India), Mandarin Chinese, Marathi (India), Norwegian (Norway), Polish (Poland), Portuguese (Brazil), Portuguese (Portugal), Punjabi (India), Romanian (Romania), Russian (Russia), Serbian (Cyrillic), Slovak (Slovakia), Slovenian (Slovenia), Spanish (Spain), Spanish (US), Swedish (Sweden), Tamil (India), Telugu (India), Thai (Thailand), Turkish (Turkey), Ukrainian (Ukraine), Urdu (India), Vietnamese (Vietnam) ,   AND MOREEEEEEEEEEEEEE \n\n\nApplication download link : https://drive.google.com/file/d/1_qYKD_Ks2UgXwp0HqY-Z1WryXbwE6LI7/view?usp=sharing', NULL, 'sent', '2025-12-19 13:12:03', NULL, '2025-12-19 13:12:04', '2025-12-19 13:12:04', NULL, '112485713608923@lid', 'Md Yousuf Ali', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('dc56e031-3fec-41c9-9b9d-7fc58b153392', 'A4535688B36BF318D1D449A501C8A6A5', '242768882471007@lid', 0, 'text', 'باذن الله رب العالمين', NULL, 'sent', '2025-12-18 02:36:13', NULL, '2025-12-18 02:37:30', '2025-12-18 02:37:30', NULL, NULL, NULL, NULL),
('dcb7cbca-aeac-4e70-bfb9-2f0b106441a5', 'A548B3704ECBECB1625BADE703B15BFD', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:23:22', NULL, '2025-12-18 23:23:22', '2025-12-18 23:23:22', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('dfffe4de-808a-4c80-a630-7031dec6014a', 'ACF422B054DB8939DC5BC5F80D817DEF', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:21:53', NULL, '2025-12-18 01:56:20', '2025-12-18 01:56:20', NULL, NULL, NULL, NULL),
('e01f9497-a881-4e17-af8d-2cef71d048e9', 'A5ACE103B5C889562C54C0841A748701', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:46', NULL, '2025-12-18 23:21:47', '2025-12-18 23:21:47', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('e0c022f8-cc21-475a-8620-1e0eb7e2ff40', 'A5E75E8EB5963A150FDB208D9276CE21', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:51:38', NULL, '2025-12-19 00:51:38', '2025-12-19 00:51:38', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('e2a82917-cb49-4bd8-91cc-083b492f3111', '3EB0DB2C19F5A39EB56870', '201273835923@s.whatsapp.net', 1, 'text', 'ok', NULL, 'sent', '2025-12-20 05:14:12', NULL, '2025-12-20 05:14:14', '2025-12-20 05:14:14', '4485e768-c912-4a42-87d5-e9b0d71cec0f', 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('e37f3c56-cb57-48fa-85c2-7c237a74cada', '3EB0C650D93C80204A78F3', '201001742924@s.whatsapp.net', 1, 'text', 'Hello from Wamate!', NULL, 'sent', '2025-12-19 00:56:22', NULL, '2025-12-19 00:56:23', '2025-12-19 00:56:23', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('e534673f-5b47-4e70-a152-551a02361a2e', 'ACFBFCCCC807C669DF1038AB8D4F704C', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:22', NULL, '2025-12-20 04:39:50', '2025-12-20 04:39:50', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('e566a674-87ff-485d-b691-b8f620c72067', '3EB0CEEEF8C3DBFA7844B7', '120363365508284247@g.us', 0, 'text', 'لذلك شركات بوابات الدفع بيخافوا من التجار لأن البنك بيحاسبهم هما ملوش علاقة بالتاجر', NULL, 'sent', '2025-12-18 03:19:16', NULL, '2025-12-18 08:58:44', '2025-12-18 08:58:44', NULL, NULL, NULL, NULL),
('e5ca946d-afad-4ee4-8ed6-213becc2e87a', '3EB020CE7EBD0DD5917054', '210994697654524@lid', 1, 'text', 'hello', NULL, 'sent', '2025-12-19 12:25:10', NULL, '2025-12-19 12:25:10', '2025-12-19 12:25:10', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('e64d8ac2-571c-494a-b32e-1a8c0abf1111', 'A519CF911C5DB07F18BA56D35AC585DF', '120363365508284247@g.us', 0, 'text', 'انا واخد توزيع فقط ومش حابب اكون وكيل 😁', NULL, 'sent', '2025-12-18 08:20:11', NULL, '2025-12-18 08:59:03', '2025-12-18 08:59:03', NULL, NULL, NULL, NULL),
('e6c39e73-7d3d-4ce5-bea9-e9f7f7d9687a', 'AC8BABFAE1C0C4A4E558899D462D3150', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:23:05', NULL, '2025-12-20 04:24:41', '2025-12-20 04:24:41', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('e89f624d-98b3-4b3b-8e09-3b80f21ef0d4', 'A531871D8062881AD8852956D1CE8734', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:25', NULL, '2025-12-18 23:21:26', '2025-12-18 23:21:26', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('e8a7a902-9fd3-465c-a56d-2f62473af23a', '3EB056BC2184A516C35A3C', '210994697654524@lid', 1, 'text', 'تمام', NULL, 'sent', '2025-12-19 06:21:14', NULL, '2025-12-19 06:21:14', '2025-12-19 06:21:14', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('eb1e3a37-f9c4-45fd-b4e9-862db7765633', 'AC3F7073A93F31422519217F51B04CF2', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 01:29:21', NULL, '2025-12-18 01:56:51', '2025-12-18 01:56:51', NULL, NULL, NULL, NULL),
('ebbf10f0-0ce3-43f9-b8f6-729431687a58', '3EB07B28F5FC65F8F0B695', '201001742924@s.whatsapp.net', 1, 'text', 'ok', NULL, 'sent', '2025-12-19 03:09:01', NULL, '2025-12-19 03:09:02', '2025-12-19 03:09:02', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('ef536df6-5047-42e8-8511-b6171cdedd96', 'AC031246006F90E54635E5DFCCAD1FD4', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:27:05', NULL, '2025-12-20 04:39:37', '2025-12-20 04:39:37', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f02524c2-e626-45ec-851b-569d9d3d94bc', '4A1A7B8A305777392ADA', 'status@broadcast', 0, 'image', '🤍', 'http://localhost:3000/public/uploads/1766055763023-4591.jpg', 'sent', '2025-12-18 11:00:40', NULL, '2025-12-18 11:02:43', '2025-12-18 11:02:43', NULL, '201017167667@s.whatsapp.net', 'Taha Ali', NULL),
('f0744b90-d5a6-47d8-a718-9ba25441ff73', 'AC9199DDF3602CA656E13510FD382C9A', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:21:19', NULL, '2025-12-20 04:22:44', '2025-12-20 04:22:44', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f0857583-c66f-46c4-a2d5-cc918322ab23', 'A54B199C68EABF3952DC49FB69328579', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:50:40', NULL, '2025-12-19 00:50:42', '2025-12-19 00:50:42', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f0d8d2fe-69f1-4b6f-a5b5-bf1a757a4fe6', '3EB020CE7EBD0DD5917054', '210994697654524@lid', 1, 'text', 'hello', NULL, 'sent', '2025-12-19 12:25:10', NULL, '2025-12-19 12:25:10', '2025-12-19 12:25:10', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f173ba64-cf8a-45a5-b5bf-a8a4c56249de', 'A50DE2CDBCB45683B9EEFE3A4A4D3C02', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-19 00:51:00', NULL, '2025-12-19 00:51:00', '2025-12-19 00:51:00', NULL, '201273835923@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f2f54079-d9a3-4017-8944-38d0f3a4cbb6', 'ACA6FED05E3F39BAB62D80EC83365DF1', '201014738598-1564967675@g.us', 0, 'text', '134_ هل تعرف الدنيا قائدا عسكريا مثل محمد؟', NULL, 'sent', '2025-12-20 04:24:50', NULL, '2025-12-20 04:39:05', '2025-12-20 04:39:05', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '262027415187523@lid', 'Essawy Hamid', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f32aa059-47d5-499d-b1c5-b33887b477f5', 'A535DAF29068BAC1D4C39CAE14E7F6BD', '242768882471007@lid', 1, 'text', 'اول ما تاني يخلص ويدخل مرحله تجريبيه حبعتلك', NULL, 'sent', '2025-12-18 02:44:26', NULL, '2025-12-18 08:58:20', '2025-12-18 08:58:20', NULL, NULL, NULL, NULL),
('f3a092be-68e6-4ab0-bea7-29a9537eba9e', 'AC3F5714A30BE5F7CD6B81A35363C4A9', '20947008491568@lid', 0, 'text', 'هاي', NULL, 'sent', '2025-12-17 22:13:37', NULL, '2025-12-17 22:14:54', '2025-12-17 22:14:54', NULL, NULL, NULL, NULL),
('f54220dc-2e29-4e29-9793-e7f50792a96d', 'ACCC7BC37153AACBD933957512036126', '209787845398651@lid', 1, 'text', 'زي الفل والله', NULL, 'sent', '2025-12-20 04:44:51', 'A51FC735C342A152F65AE6DEF4AF5C28', '2025-12-20 04:46:08', '2025-12-20 04:46:08', '4485e768-c912-4a42-87d5-e9b0d71cec0f', 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('f5c3d378-b3ed-49a7-9f8a-7a18aeeac6d2', 'A582BDB6BBC54FFA710B0D297B0E508C', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:22:32', NULL, '2025-12-18 23:22:32', '2025-12-18 23:22:32', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('f5cda8d7-d33c-4fa8-81e1-a71cc01af4d4', 'AC6C97255EE5D8287C462F3B00FFFC96', '120363403291850277@g.us', 0, 'text', 'مال ده باللغه', NULL, 'sent', '2025-12-18 10:47:59', 'AC1AFB8903924525F1551AF659D27783', '2025-12-18 10:49:16', '2025-12-18 10:49:16', NULL, '229149557964900@lid', 'AHMED RAMADAN', NULL),
('f7634d7f-547d-44f7-b995-0c186892690f', 'AC468182F6E0ADA856A11B91C80CB167', '120363403291850277@g.us', 0, 'senderKeyDistribution', '👍', NULL, 'sent', '2025-12-18 10:44:06', NULL, '2025-12-18 10:45:30', '2025-12-18 10:45:30', NULL, '229149557964900@lid', 'AHMED RAMADAN', NULL),
('f8946c52-79c7-4f0e-864f-4c95c115b35f', '2AA3C6A715C4884CE0AB', 'status@broadcast', 0, 'senderKeyDistribution', '🤍', 'http://localhost:3000/public/uploads/1766055761746-4649.jpg', 'sent', '2025-12-18 11:00:35', NULL, '2025-12-18 11:02:42', '2025-12-18 11:02:42', NULL, '201017167667@s.whatsapp.net', 'Taha Ali', NULL),
('f9e5855a-30e8-4618-a8ba-1f4206f3d2d4', 'AC3E7F36D7F97149E6E0D6B5B706D104', '120363365508284247@g.us', 0, 'reaction', 'reactionMessage', NULL, 'sent', '2025-12-18 03:11:56', NULL, '2025-12-18 08:58:41', '2025-12-18 08:58:41', NULL, NULL, NULL, NULL),
('fa8e0bf9-abea-4144-bca4-38c9eac3bac9', '3EB0DDCCF61F418067EF21', '201006348127@s.whatsapp.net', 0, 'text', 'واختار اوبجكتيف انجيج مينت تفاعل', NULL, 'sent', '2025-12-18 09:57:56', NULL, '2025-12-18 10:08:15', '2025-12-18 10:08:15', NULL, '201006348127@s.whatsapp.net', 'علاء فايد', NULL),
('fb2180ce-10dc-4e8d-8e47-f37b146294ab', 'ACB99B317BAD7C85EEEDC9B877608B47', '201001742924@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-20 04:23:02', NULL, '2025-12-20 04:24:32', '2025-12-20 04:24:32', '4485e768-c912-4a42-87d5-e9b0d71cec0f', '201001742924@s.whatsapp.net', NULL, '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('fb7e4d08-c394-48de-9f37-b04d2deed5b4', 'A55A9B36E94FEA00D6A6F7EBC0CDEF02', '201273835923@s.whatsapp.net', 0, 'protocol', 'protocolMessage', NULL, 'sent', '2025-12-18 23:21:25', NULL, '2025-12-18 23:21:26', '2025-12-18 23:21:26', NULL, '201273835923@s.whatsapp.net', NULL, NULL),
('fcec5759-e1ce-4f49-93b7-e06ba21f3574', 'AC228FF88D70F85DE9F97A413B832726', '120363421536577519@g.us', 0, 'senderKeyDistribution', '❤️', NULL, 'sent', '2025-12-19 16:21:47', NULL, '2025-12-19 16:21:48', '2025-12-19 16:21:48', NULL, '178980195971294@lid', 'Vikram Yadav', '2db80e6b-0a94-460b-bd2c-4fd26ade60db'),
('fe096a26-ffec-449b-a148-88c8284c6df6', 'AC37F012F1104DA024F97FF1544FAC9C', '120363403291850277@g.us', 0, 'text', 'خذ اكسس على بزنس برتفليو واعمل انت ad account', NULL, 'sent', '2025-12-18 11:00:10', '2AA535E45C19D03D47C6', '2025-12-18 11:02:27', '2025-12-18 11:02:27', NULL, '194686723616922@lid', 'Dr.Bob', NULL),
('ffce92dd-09af-41e3-a8fb-b929099fcbbe', '3EB06CFCDC22AB3D08BBD7', '201001742924@s.whatsapp.net', 1, 'text', 'hello', NULL, 'sent', '2025-12-19 12:24:49', NULL, '2025-12-19 12:24:49', '2025-12-19 12:24:49', NULL, 'me', 'Me', '2db80e6b-0a94-460b-bd2c-4fd26ade60db');

-- --------------------------------------------------------

--
-- Table structure for table `message_logs`
--

CREATE TABLE `message_logs` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT 'text',
  `status` enum('pending','sent','delivered','read','failed') DEFAULT 'pending',
  `error` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `instance_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `monthly_message_limit` int DEFAULT '1000',
  `max_instances` int DEFAULT '1',
  `max_seats` int DEFAULT '1',
  `description` text,
  `billing_cycle` enum('monthly','quarterly','yearly','lifetime') DEFAULT 'monthly',
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `price`, `monthly_message_limit`, `max_instances`, `max_seats`, `description`, `billing_cycle`, `is_active`, `createdAt`, `updatedAt`) VALUES
('0703349f-74ae-4d13-938f-6cd0ca5d1a68', 'free', 0.00, 100, 1, 1, 'Connectivity for individuals.', 'monthly', 1, '2025-12-18 10:30:37', '2025-12-19 03:10:12'),
('5a12c7a1-d786-4e6e-9cbc-c69cc72057e9', 'pro', 5.00, 10000, 5, 5, 'Growth tier for small teams.', 'monthly', 1, '2025-12-18 10:30:37', '2025-12-18 11:11:57'),
('acf4fc06-ac76-498b-a9c9-74448d6ef188', 'enterprise', 25.00, 100000, 20, 20, 'Global scale operations.', 'monthly', 1, '2025-12-18 10:30:37', '2025-12-18 11:12:15');

-- --------------------------------------------------------

--
-- Table structure for table `seats`
--

CREATE TABLE `seats` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `status` enum('online','offline','busy') DEFAULT 'offline',
  `last_active` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `instance_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `assigned_chats_count` int DEFAULT '0',
  `last_assigned_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `seats`
--

INSERT INTO `seats` (`id`, `status`, `last_active`, `createdAt`, `updatedAt`, `user_id`, `instance_id`, `name`, `email`, `password`, `assigned_chats_count`, `last_assigned_at`) VALUES
('fafc4122-3577-43e5-b402-00d19bbb6190', 'offline', '2025-12-18 00:08:07', '2025-12-18 00:08:07', '2025-12-18 00:08:07', '2db80e6b-0a94-460b-bd2c-4fd26ade60db', NULL, 'shady', 'shady.rasmy@gmail.com', '$2b$12$VqFbuNV8ewHQBP7MJZHn9.RlYE2X.BcsAkmIYJtVY7ZMPQALEVMI.', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `site_configs`
--

CREATE TABLE `site_configs` (
  `id` int NOT NULL,
  `cms_visibility` json DEFAULT NULL,
  `header_scripts` text,
  `fb_pixel_id` varchar(255) DEFAULT NULL,
  `fb_capi_token` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `landing_content` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `site_configs`
--

INSERT INTO `site_configs` (`id`, `cms_visibility`, `header_scripts`, `fb_pixel_id`, `fb_capi_token`, `createdAt`, `updatedAt`, `landing_content`) VALUES
(1, '{\"hero\": true, \"whyUs\": true, \"howEasy\": true, \"numbers\": true, \"benefits\": true}', NULL, NULL, NULL, '2025-12-19 00:46:56', '2025-12-19 03:13:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `max_instances` int DEFAULT '1',
  `max_seats` int DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `monthly_message_limit` int DEFAULT '1000',
  `messages_sent_current_period` int DEFAULT '0',
  `subscription_start_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `subscription_end_date` datetime DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `id_plan` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `access_token`, `role`, `max_instances`, `max_seats`, `createdAt`, `updatedAt`, `monthly_message_limit`, `messages_sent_current_period`, `subscription_start_date`, `is_active`, `subscription_end_date`, `phone_number`, `id_plan`) VALUES
('2db80e6b-0a94-460b-bd2c-4fd26ade60db', 'shady', 'shady.rasmy85@gmail.com', '$2b$12$Qruo1ZYMng5JlO/Y5/LFrOFnWecnftqRoZ1cy2ctaoA/kszxBE/Ri', '225d76de-4926-414f-b78f-cf0a4de996b0', 'admin', 100, 1, '2025-12-16 23:52:55', '2025-12-20 05:14:11', 10000, 27, NULL, 1, NULL, NULL, NULL),
('3066066c-0680-4223-9d42-2188f7ef0e5a', 'ahmed', 'ahmed@gmail.com', '$2b$12$7sqHE0KdR8XIpWsl8Gq3CuQugu6Qdnge.VKV6iBRo9x8FgqMzEUd2', 'f36d5aa9-24d7-43e9-9880-d8c3bd5b145b', 'user', 1, 1, '2025-12-17 13:06:48', '2025-12-17 13:06:48', 1000, 0, '2025-12-17 13:06:48', 1, NULL, NULL, NULL),
('99553cb3-9572-4f0e-b754-873a48cf0875', 'Mahy Talaat ', 'mahitabtalaat94@gmail.com', '$2b$12$WE8QtR5Aegei3cciAnzEseOrQye9C0Wu1/APaz1zus1IdbmKdNLye', '38a86406-352f-4b78-8d57-de5828b1e7e2', 'user', 1, 1, '2025-12-19 00:43:40', '2025-12-19 00:43:40', 1000, 0, '2025-12-19 00:43:40', 1, NULL, NULL, NULL),
('c8f5a822-c081-413f-a7aa-5a1eb68d4c9f', 'ahmed', 'shady@gmail.com', '$2b$12$H4Q/gdeS6YiSb59EFHrxbufiONjQGsrQhAjkiE0iCP2uZ9r7ixEg6', 'c6975a31-6b59-4f35-9182-93cf1e668d34', 'user', 1, 1, '2025-12-18 01:16:14', '2025-12-18 01:16:14', 1000, 0, '2025-12-18 01:16:14', 1, NULL, NULL, NULL),
('d1cc3524-7667-4395-b1ad-4953322b8ce9', 'shady rasmy', 'Shady.rasmy25@gmail.com', '$2b$12$L.Hzldyki6J8fgAKe/HkduzUQSEwivqiGmGeoii1MwkUIjttLNjDa', '7cb95e88-adfc-469d-b7f9-e80ad9045e7c', 'user', 1, 1, '2025-12-18 22:58:37', '2025-12-18 22:58:37', 1000, 0, '2025-12-18 22:58:37', 1, NULL, NULL, NULL),
('f1c958c6-aa58-4a5a-84cb-bc3f3b620031', 'Test Admin', 'admin@test.com', 'password123', '859c3c08-588b-42f0-a2ab-c5afeee4a530', 'admin', 1, 1, '2025-12-17 14:24:24', '2025-12-17 14:24:24', 1000, 0, '2025-12-17 14:24:24', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_instances`
--

CREATE TABLE `whatsapp_instances` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `instance_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `status` enum('disconnected','connecting','connected') DEFAULT 'disconnected',
  `qr_code` text,
  `session_data` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `chat_enabled` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `whatsapp_instances`
--

INSERT INTO `whatsapp_instances` (`id`, `instance_id`, `name`, `phone_number`, `status`, `qr_code`, `session_data`, `is_active`, `createdAt`, `updatedAt`, `user_id`, `chat_enabled`) VALUES
('3036ceb2-89a3-4a79-9339-bc91df1350f2', '52ee91cd-698d-4696-bb36-0239c23df91d', 'WhatsApp Node 1', NULL, 'disconnected', '2@PQgtzH9o6r8IWLGjBtHYnAB5uWabtYWw40EWGCdVBk6xOaL9aCr8KGZ1LijBKF7VTYELXyKjkvuTJXEI9Ku2YgMAKiBaVw1Tl7E=,VZ46fcXH5/ICFzQZSA3SWhIl9QUVk345jwSPxpoGUUI=,gMR8DrV/dsvCO9MDszEKfZvkezCSVyyRGDrU6fcFrmA=,NnZd3R5z8VCodV36rfHMxPOTXWVGOpeANhJgRqx2IzU=', NULL, 1, '2025-12-19 02:58:05', '2025-12-19 03:14:38', 'd1cc3524-7667-4395-b1ad-4953322b8ce9', 1),
('4485e768-c912-4a42-87d5-e9b0d71cec0f', 'd6f15d08-b2ee-4098-9b78-0f8bd2e8fa28', 'WhatsApp Node 2', '201001742924', 'connected', NULL, NULL, 1, '2025-12-20 04:20:45', '2025-12-20 05:10:35', '2db80e6b-0a94-460b-bd2c-4fd26ade60db', 1),
('ca85fe1d-c906-48e6-8b19-b43df5b4eb76', 'bec543c3-bbdb-41eb-9bfa-e3adf4f8a470', 'Mock Instance', '1234567890', 'disconnected', '2@OOwSxRn4F9dRofrH+QBQP8Y39K8nZWgj4HXfouZ+rdOL9duhK6OmRh61pDL47Hq1VqK07tgCNCrAmVnWrZkVwbZck7eOLrYMh/0=,Afg4Q55ccFJWbJImtuLYYbOus5W7ii6i9pnpiJIofjI=,o1LXbj82V18j6vyFvpgV5Z8dIxDHIFBOAbYcF47KjWA=,YE5r+9w5SL05I9M/7b48JvT6fbr/CBuQwV5V+OoEo+U=', NULL, 1, '2025-12-17 14:24:24', '2025-12-17 14:46:07', 'f1c958c6-aa58-4a5a-84cb-bc3f3b620031', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contacts_instance_id_jid` (`instance_id`,`jid`),
  ADD UNIQUE KEY `contacts_user_id_jid` (`user_id`,`jid`),
  ADD KEY `assigned_seat_id` (`assigned_seat_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `messages_instance_id_message_id` (`instance_id`,`message_id`),
  ADD KEY `messages_instance_id_jid` (`instance_id`,`jid`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `message_logs`
--
ALTER TABLE `message_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `instance_id` (`instance_id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`);

--
-- Indexes for table `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `instance_id` (`instance_id`);

--
-- Indexes for table `site_configs`
--
ALTER TABLE `site_configs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `access_token` (`access_token`),
  ADD UNIQUE KEY `access_token_2` (`access_token`),
  ADD UNIQUE KEY `access_token_3` (`access_token`),
  ADD UNIQUE KEY `access_token_4` (`access_token`),
  ADD UNIQUE KEY `access_token_5` (`access_token`),
  ADD UNIQUE KEY `access_token_6` (`access_token`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `access_token_7` (`access_token`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `access_token_8` (`access_token`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `access_token_9` (`access_token`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `access_token_10` (`access_token`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `access_token_11` (`access_token`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `access_token_12` (`access_token`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `access_token_13` (`access_token`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `access_token_14` (`access_token`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `access_token_15` (`access_token`),
  ADD KEY `id_plan` (`id_plan`);

--
-- Indexes for table `whatsapp_instances`
--
ALTER TABLE `whatsapp_instances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `instance_id` (`instance_id`),
  ADD UNIQUE KEY `instance_id_2` (`instance_id`),
  ADD UNIQUE KEY `instance_id_3` (`instance_id`),
  ADD UNIQUE KEY `instance_id_4` (`instance_id`),
  ADD UNIQUE KEY `instance_id_5` (`instance_id`),
  ADD UNIQUE KEY `instance_id_6` (`instance_id`),
  ADD UNIQUE KEY `instance_id_7` (`instance_id`),
  ADD UNIQUE KEY `instance_id_8` (`instance_id`),
  ADD UNIQUE KEY `instance_id_9` (`instance_id`),
  ADD UNIQUE KEY `instance_id_10` (`instance_id`),
  ADD UNIQUE KEY `instance_id_11` (`instance_id`),
  ADD UNIQUE KEY `instance_id_12` (`instance_id`),
  ADD UNIQUE KEY `instance_id_13` (`instance_id`),
  ADD UNIQUE KEY `instance_id_14` (`instance_id`),
  ADD UNIQUE KEY `instance_id_15` (`instance_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `site_configs`
--
ALTER TABLE `site_configs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_38` FOREIGN KEY (`instance_id`) REFERENCES `whatsapp_instances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `contacts_ibfk_39` FOREIGN KEY (`assigned_seat_id`) REFERENCES `seats` (`id`),
  ADD CONSTRAINT `contacts_ibfk_40` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_19` FOREIGN KEY (`instance_id`) REFERENCES `whatsapp_instances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `message_logs`
--
ALTER TABLE `message_logs`
  ADD CONSTRAINT `message_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `message_logs_ibfk_2` FOREIGN KEY (`instance_id`) REFERENCES `whatsapp_instances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `seats_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `seats_ibfk_30` FOREIGN KEY (`instance_id`) REFERENCES `whatsapp_instances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_plan`) REFERENCES `plans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `whatsapp_instances`
--
ALTER TABLE `whatsapp_instances`
  ADD CONSTRAINT `whatsapp_instances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
