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
