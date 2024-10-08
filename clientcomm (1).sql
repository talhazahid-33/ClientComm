-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2024 at 02:40 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clientcomm`
--

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `messageId` char(36) NOT NULL,
  `roomId` text NOT NULL,
  `time` varchar(50) NOT NULL,
  `sender` text NOT NULL,
  `seen` tinyint(1) NOT NULL DEFAULT 0,
  `fileName` text NOT NULL,
  `fileType` text NOT NULL,
  `Data` longblob NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'file',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `messageId` char(36) NOT NULL,
  `roomId` int(11) NOT NULL,
  `time` varchar(50) NOT NULL,
  `sender` text NOT NULL,
  `seen` tinyint(1) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'text',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `fileType` text DEFAULT NULL,
  `name` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `owner` varchar(100) NOT NULL DEFAULT 'both'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`messageId`, `roomId`, `time`, `sender`, `seen`, `message`, `type`, `createdAt`, `fileType`, `name`, `data`, `owner`) VALUES
('079abed2-f8e2-4965-945b-192935a4b676', 2, '9:48 PM', 'hamza', 0, 'sncks', 'text', '2024-10-07 16:48:23', NULL, NULL, NULL, 'both'),
('0ae7299b-65f8-4fff-ba61-26eb1b94c219', 1, '8:30 PM', 'hamza', 0, '', 'audio', '2024-10-07 15:30:01', 'audio/webm', 'recorded-audio.webm', 'Uploads/file-1728315001519-988019336.webm', 'both'),
('1b0f46f2-9926-4151-bb0b-a15aa7291bf5', 5, '6:21 PM', 'hamza', 0, '', 'image', '2024-10-07 13:21:53', 'image/jpeg', 'MERN.jpg', 'Uploads/file-1728307313226-517691816.jpg', 'both'),
('2024-10-08 17:29:51.723765', 4, '2024-10-08 17:29:51.723765', 'huzaifa', 0, 'yo', 'text', '2024-10-08 12:29:51', NULL, NULL, NULL, 'both'),
('2024-10-08 17:29:59.354236', 4, '2024-10-08 17:29:59.354236', 'huzaifa', 0, 'gg', 'text', '2024-10-08 12:29:58', NULL, NULL, NULL, 'both'),
('2024-10-08 17:30:09.628918', 4, '2024-10-08 17:30:09.628918', 'huzaifa', 0, '', 'video', '2024-10-08 12:30:20', 'mp4', 'file-1727713006025-128010633.mp4', 'Uploads/file-1728390620015-87454886.mp4', 'both'),
('2024-10-08 17:30:41.256774', 4, '2024-10-08 17:30:41.256774', 'huzaifa', 0, 'hh', 'text', '2024-10-08 12:30:40', NULL, NULL, NULL, 'both'),
('2024-10-08 17:31:09.690269', 4, '2024-10-08 17:31:09.690269', 'huzaifa', 0, '', 'audio', '2024-10-08 12:31:10', 'mp3', 'file_example_MP3_700KB.mp3', 'Uploads/file-1728390670601-733119142.mp3', 'both'),
('27afa3b4-b09d-4b52-9c33-e572dfc8f244', 1, '6:27 PM', 'hamza', 0, '', 'video', '2024-10-07 13:27:09', 'video/mp4', 'CSRF Lab3.mp4', 'Uploads/file-1728307629308-509812345.mp4', 'both'),
('3993d664-cf6b-4181-bed9-f70e57479096', 5, '6:26 PM', 'hamza', 0, '', 'document', '2024-10-07 13:26:21', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Programming Fundamentals Midterm-I Fall 2020 Lahore.docx', 'Uploads/file-1728307581565-598336347.docx', 'both'),
('4a3c673a-8003-4a31-9018-19bc12ebf0fd', 2, '9:09 PM', 'hamza', 0, ' kc;cs', 'text', '2024-10-07 16:09:21', NULL, NULL, NULL, 'both'),
('5471e46d-685a-43d9-9873-7ae4542dfc46', 5, '6:22 PM', 'hamza', 0, '', 'audio', '2024-10-07 13:22:40', 'audio/webm', 'recorded-audio.webm', 'Uploads/file-1728307360495-23550413.webm', 'both'),
('54d4b161-6a45-46f9-997e-77a379803608', 1, '8:29 PM', 'hamza', 0, 'From Hanza', 'text', '2024-10-07 15:29:19', NULL, NULL, NULL, 'both'),
('643f0679-592f-4e2e-a413-25673c755ee2', 5, '6:21 PM', 'hamza', 0, 'Hello in bilal 3', 'text', '2024-10-07 13:21:23', NULL, NULL, NULL, 'both'),
('7850265a-b28b-4fbd-84dc-e19b74b32a35', 5, '5:54 PM', 'hamza', 0, 'Again in bilal', 'text', '2024-10-07 12:54:38', NULL, NULL, NULL, 'both'),
('94033e91-893d-43be-9503-b8344e59f071', 1, '9:49 PM', 'hamza', 1, 'jkanskxa', 'text', '2024-10-07 16:49:25', NULL, NULL, NULL, 'both'),
('9a047881-9d10-4156-bdf5-3f88be17c8ef', 1, '5:54 PM', 'hamza', 0, 'Hi in 1', 'text', '2024-10-07 12:54:24', NULL, NULL, NULL, 'both'),
('9b936450-bf7f-4fee-b96c-0e2dd72b5c9d', 5, '6:23 PM', 'hamza', 0, '', 'image', '2024-10-07 13:23:14', 'image/jpeg', 'MERN (1).jpg', 'Uploads/file-1728307394140-480283495.jpg', 'both'),
('a0e74a3b-5097-4ce1-98ed-8fb10aebe932', 5, '6:25 PM', 'hamza', 0, '', 'document', '2024-10-07 13:25:11', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Programming Fundamentals Midterm-I Fall 2020 Lahore.docx', 'Uploads/file-1728307511776-945169991.docx', 'both'),
('aa967025-9ee1-440f-ae39-18233449e981', 1, '9:10 PM', 'talha', 0, 'ijfvkld', 'text', '2024-10-07 16:10:38', NULL, NULL, NULL, 'user'),
('b6fd5c3d-a58f-4bab-af1a-83ba28044e70', 2, '5:54 PM', 'hamza', 0, 'Hello ', 'text', '2024-10-07 12:54:18', NULL, NULL, NULL, 'both'),
('bc4e1ebc-25a2-46c4-b58c-16d16bb5a5ae', 1, '9:09 PM', 'talha', 0, 'vxvxvs', 'text', '2024-10-07 16:09:39', NULL, NULL, NULL, 'both'),
('befaac11-3481-4eb0-94f8-b7411e7c6b48', 1, '8:29 PM', 'hamza', 0, 'cuhc', 'text', '2024-10-07 15:29:31', NULL, NULL, NULL, 'both'),
('dd76c99e-526c-49e2-a59d-14cec81cdfc8', 5, '5:54 PM', 'hamza', 0, 'Hello Bilal', 'text', '2024-10-07 12:54:34', NULL, NULL, NULL, 'both'),
('e3c52065-5b4d-4509-94e8-f94e6cb86599', 1, '8:29 PM', 'hamza', 0, '/agian', 'text', '2024-10-07 15:29:29', NULL, NULL, NULL, 'both'),
('e4dc4ff7-076d-4ab0-9736-1b17ed851dfc', 1, '8:28 PM', 'hamza', 0, 'Hello', 'text', '2024-10-07 15:28:46', NULL, NULL, NULL, 'both'),
('f4f729fc-27af-43aa-b08d-464e76255f29', 1, '8:29 PM', 'hamza', 0, 'Hii', 'text', '2024-10-07 15:29:16', NULL, NULL, NULL, 'both'),
('fdb9ee37-61d2-4b94-85a9-278af265e0ee', 1, '9:48 PM', 'talha', 0, 'Hello', 'text', '2024-10-07 16:48:33', NULL, NULL, NULL, 'both');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `roomId` int(11) NOT NULL,
  `lastMessage` text NOT NULL DEFAULT '',
  `username` text NOT NULL,
  `newMessages` int(11) DEFAULT 0,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`roomId`, `lastMessage`, `username`, `newMessages`, `updatedAt`) VALUES
(1, 'jkanskxa', 'talha', 0, '2024-10-07 16:49:25'),
(2, 'sncks', 'hamza', 0, '2024-10-07 16:48:24'),
(4, 'hh', 'huzaifa', 0, '2024-10-08 12:30:40'),
(5, 'Hello in bilal 3', 'bilal', 0, '2024-10-07 13:21:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `email`, `password`) VALUES
(1, 'talha', 'talha@gmail.com', '123456'),
(2, 'hamza', 'hamza@gmail.com', '123456'),
(3, 'anas', 'anas@gmail.com', '123456'),
(4, 'huzaifa', 'huzi@gmail.com', '123456'),
(5, 'bilal', 'bilal@gmail.com', '123457'),
(6, 'ali', 'ali@gmail.com', '123456');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`messageId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`messageId`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`roomId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
