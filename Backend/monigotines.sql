-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-06-2025 a las 22:53:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `monigotines`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `avatar`
--

CREATE TABLE `avatar` (
  `id` int(10) UNSIGNED NOT NULL,
  `correo` int(10) UNSIGNED NOT NULL,
  `clave` varchar(48) NOT NULL,
  `nombre` varchar(24) NOT NULL,
  `genero` tinyint(3) UNSIGNED NOT NULL,
  `piel` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `emocion` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `pelo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `tinte` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `torso` tinyint(3) UNSIGNED NOT NULL DEFAULT 3,
  `color` tinyint(3) UNSIGNED NOT NULL DEFAULT 2,
  `cadera` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `tela` tinyint(3) UNSIGNED NOT NULL DEFAULT 2,
  `rol` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `clase` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `mensaje` varchar(200) NOT NULL DEFAULT '',
  `descripcion` varchar(600) NOT NULL DEFAULT '',
  `link` varchar(128) NOT NULL DEFAULT '',
  `musica` varchar(128) NOT NULL DEFAULT '',
  `registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `avatar`
--
DELIMITER $$
CREATE TRIGGER `actualiza_avatar` AFTER UPDATE ON `avatar` FOR EACH ROW BEGIN
	UPDATE preregistro SET clave='' WHERE id=NEW.correo;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `nuevo_avatar` AFTER INSERT ON `avatar` FOR EACH ROW BEGIN
	INSERT INTO ideologia (avatar) VALUES (NEW.id);
	INSERT INTO mover (avatar) VALUES (NEW.id);
    UPDATE preregistro SET clave='' WHERE id=NEW.correo;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bloqueo`
--

CREATE TABLE `bloqueo` (
  `id` int(10) UNSIGNED NOT NULL,
  `bloqueador` int(10) UNSIGNED NOT NULL,
  `bloqueado` int(10) UNSIGNED NOT NULL,
  `estado` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ideologia`
--

CREATE TABLE `ideologia` (
  `id` int(10) UNSIGNED NOT NULL,
  `avatar` int(10) UNSIGNED NOT NULL,
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `nacimiento` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `zodiaco` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `elemento` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `ang_dem` tinyint(4) NOT NULL DEFAULT 0,
  `izq_der` tinyint(4) NOT NULL DEFAULT 0,
  `pol_lad` tinyint(4) NOT NULL DEFAULT 0,
  `rel_cie` tinyint(4) NOT NULL DEFAULT 0,
  `mon_pol` tinyint(4) NOT NULL DEFAULT 0,
  `car_veg` tinyint(4) NOT NULL DEFAULT 0,
  `ext_int` tinyint(4) NOT NULL DEFAULT 0,
  `azu_roj` tinyint(4) NOT NULL DEFAULT 0,
  `pas_fut` tinyint(4) NOT NULL DEFAULT 0,
  `urb_cam` tinyint(4) NOT NULL DEFAULT 0,
  `art_ing` tinyint(4) NOT NULL DEFAULT 0,
  `fie_est` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mail`
--

CREATE TABLE `mail` (
  `id` int(10) UNSIGNED NOT NULL,
  `emisor` int(10) UNSIGNED NOT NULL,
  `receptor` int(10) UNSIGNED NOT NULL,
  `mensaje` varchar(400) NOT NULL,
  `visto` tinyint(4) NOT NULL DEFAULT 0,
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mobiliario`
--

CREATE TABLE `mobiliario` (
  `id` int(10) UNSIGNED NOT NULL,
  `creador` int(10) UNSIGNED NOT NULL,
  `tipo` tinyint(3) UNSIGNED NOT NULL,
  `pos_x` int(11) NOT NULL,
  `pos_y` int(11) NOT NULL,
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mover`
--

CREATE TABLE `mover` (
  `id` int(10) UNSIGNED NOT NULL,
  `avatar` int(10) UNSIGNED NOT NULL,
  `pos_x` int(11) NOT NULL DEFAULT 0,
  `pos_y` int(11) NOT NULL DEFAULT 0,
  `mensaje` varchar(200) NOT NULL DEFAULT '',
  `silenciar` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preregistro`
--

CREATE TABLE `preregistro` (
  `id` int(10) UNSIGNED NOT NULL,
  `correo` varchar(64) NOT NULL,
  `clave` varchar(12) NOT NULL,
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reaccion`
--

CREATE TABLE `reaccion` (
  `id` int(10) UNSIGNED NOT NULL,
  `emisor` int(10) UNSIGNED NOT NULL,
  `receptor` int(10) UNSIGNED NOT NULL,
  `tipo` tinyint(3) UNSIGNED NOT NULL,
  `actualiza` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `avatar`
--
ALTER TABLE `avatar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unico_nombre` (`nombre`),
  ADD KEY `avatar_correo` (`correo`);

--
-- Indices de la tabla `bloqueo`
--
ALTER TABLE `bloqueo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bloqueos_bloqueado` (`bloqueado`),
  ADD KEY `bloqueos_bloqueador` (`bloqueador`);

--
-- Indices de la tabla `ideologia`
--
ALTER TABLE `ideologia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ideologia_avatar` (`avatar`);

--
-- Indices de la tabla `mail`
--
ALTER TABLE `mail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emisor_avatar` (`emisor`),
  ADD KEY `receptor_avatar` (`receptor`);

--
-- Indices de la tabla `mobiliario`
--
ALTER TABLE `mobiliario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mobiliario_avatar` (`creador`);

--
-- Indices de la tabla `mover`
--
ALTER TABLE `mover`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mover_avatar` (`avatar`);

--
-- Indices de la tabla `preregistro`
--
ALTER TABLE `preregistro`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unico_correo` (`correo`);

--
-- Indices de la tabla `reaccion`
--
ALTER TABLE `reaccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `avatar_emisor` (`emisor`),
  ADD KEY `avatar_receptor` (`receptor`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `avatar`
--
ALTER TABLE `avatar`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bloqueo`
--
ALTER TABLE `bloqueo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ideologia`
--
ALTER TABLE `ideologia`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mail`
--
ALTER TABLE `mail`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mobiliario`
--
ALTER TABLE `mobiliario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mover`
--
ALTER TABLE `mover`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preregistro`
--
ALTER TABLE `preregistro`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reaccion`
--
ALTER TABLE `reaccion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `avatar`
--
ALTER TABLE `avatar`
  ADD CONSTRAINT `avatar_correo` FOREIGN KEY (`correo`) REFERENCES `preregistro` (`id`);

--
-- Filtros para la tabla `bloqueo`
--
ALTER TABLE `bloqueo`
  ADD CONSTRAINT `bloqueos_bloqueado` FOREIGN KEY (`bloqueado`) REFERENCES `avatar` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `bloqueos_bloqueador` FOREIGN KEY (`bloqueador`) REFERENCES `avatar` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ideologia`
--
ALTER TABLE `ideologia`
  ADD CONSTRAINT `ideologia_avatar` FOREIGN KEY (`avatar`) REFERENCES `avatar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mail`
--
ALTER TABLE `mail`
  ADD CONSTRAINT `emisor_avatar` FOREIGN KEY (`emisor`) REFERENCES `avatar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `receptor_avatar` FOREIGN KEY (`receptor`) REFERENCES `avatar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mobiliario`
--
ALTER TABLE `mobiliario`
  ADD CONSTRAINT `mobiliario_avatar` FOREIGN KEY (`creador`) REFERENCES `avatar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mover`
--
ALTER TABLE `mover`
  ADD CONSTRAINT `mover_avatar` FOREIGN KEY (`avatar`) REFERENCES `avatar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reaccion`
--
ALTER TABLE `reaccion`
  ADD CONSTRAINT `avatar_emisor` FOREIGN KEY (`emisor`) REFERENCES `avatar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `avatar_receptor` FOREIGN KEY (`receptor`) REFERENCES `avatar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
