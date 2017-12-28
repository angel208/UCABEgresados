CREATE DATABASE  IF NOT EXISTS `ucabegresado` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci */;
USE `ucabegresado`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ucabegresado
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargo` (
  `IDCargo` int(11) NOT NULL AUTO_INCREMENT,
  `NombreCargo` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`IDCargo`)
) ENGINE=InnoDB AUTO_INCREMENT=1022 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES (1017,'cargo1','cargo'),(1018,'Consejo de Extensión','consejo extension'),(1019,'Consejo Universitario','consejo universitario'),(1020,'Consejo de Escuela de Ingeniería Informática','consejo'),(1021,'Consejo de Escuela de Ingeniería Civil','consejo');
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargosxcarrera`
--

DROP TABLE IF EXISTS `cargosxcarrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargosxcarrera` (
  `Carrera_IDCarrera` int(11) NOT NULL,
  `Cargo_IDCargo` int(11) NOT NULL,
  `PeriodoElectoral_IDPE` varchar(20) NOT NULL,
  `Conformado` tinyint(4) NOT NULL,
  PRIMARY KEY (`Carrera_IDCarrera`,`Cargo_IDCargo`,`PeriodoElectoral_IDPE`),
  KEY `fk_CargosxCarrera_Cargo1_idx` (`Cargo_IDCargo`),
  KEY `fk_CargosxCarrera_PeriodoElectoral1_idx` (`PeriodoElectoral_IDPE`),
  CONSTRAINT `fk_CargosxCarrera_Cargo1` FOREIGN KEY (`Cargo_IDCargo`) REFERENCES `cargo` (`IDCargo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_CargosxCarrera_Carrera1` FOREIGN KEY (`Carrera_IDCarrera`) REFERENCES `carrera` (`IDCarrera`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_CargosxCarrera_PeriodoElectoral1` FOREIGN KEY (`PeriodoElectoral_IDPE`) REFERENCES `periodoelectoral` (`IDPE`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargosxcarrera`
--

LOCK TABLES `cargosxcarrera` WRITE;
/*!40000 ALTER TABLE `cargosxcarrera` DISABLE KEYS */;
INSERT INTO `cargosxcarrera` VALUES (1000,1018,'2016-2018',0),(1000,1019,'2016-2018',0),(1000,1020,'2016-2018',0),(1001,1018,'2016-2018',0),(1001,1019,'2016-2018',0),(1001,1021,'2016-2018',0);
/*!40000 ALTER TABLE `cargosxcarrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrera`
--

DROP TABLE IF EXISTS `carrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carrera` (
  `IDCarrera` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`IDCarrera`)
) ENGINE=InnoDB AUTO_INCREMENT=1002 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrera`
--

LOCK TABLES `carrera` WRITE;
/*!40000 ALTER TABLE `carrera` DISABLE KEYS */;
INSERT INTO `carrera` VALUES (1000,'Ingeniería Infomática','Ingenieria Informatica'),(1001,'Ingeniería Civil','asdasd');
/*!40000 ALTER TABLE `carrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datosegresado`
--

DROP TABLE IF EXISTS `datosegresado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datosegresado` (
  `CIEgresado` int(11) NOT NULL,
  `CorreoUCAB` varchar(45) NOT NULL,
  `AnoIngreso` int(11) NOT NULL,
  `AnoEgreso` int(11) NOT NULL,
  `Eficiencia1` tinyint(4) NOT NULL,
  PRIMARY KEY (`CIEgresado`),
  CONSTRAINT `CIEgresado` FOREIGN KEY (`CIEgresado`) REFERENCES `egresado` (`CI`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datosegresado`
--

LOCK TABLES `datosegresado` WRITE;
/*!40000 ALTER TABLE `datosegresado` DISABLE KEYS */;
/*!40000 ALTER TABLE `datosegresado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directorescuela`
--

DROP TABLE IF EXISTS `directorescuela`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directorescuela` (
  `CI` int(11) NOT NULL,
  `Nombres` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
  `Apellidos` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
  `IDCarrera` int(11) NOT NULL,
  `IDUsuario` int(11) NOT NULL,
  PRIMARY KEY (`CI`),
  KEY `IDCarrera` (`IDCarrera`),
  KEY `IDUsuario` (`IDUsuario`),
  CONSTRAINT `carrerafk` FOREIGN KEY (`IDCarrera`) REFERENCES `carrera` (`IDCarrera`),
  CONSTRAINT `usuariofk` FOREIGN KEY (`IDUsuario`) REFERENCES `usuario` (`IDUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directorescuela`
--

LOCK TABLES `directorescuela` WRITE;
/*!40000 ALTER TABLE `directorescuela` DISABLE KEYS */;
INSERT INTO `directorescuela` VALUES (345623,'maria cora','urdaneta',1000,2);
/*!40000 ALTER TABLE `directorescuela` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `egresado`
--

DROP TABLE IF EXISTS `egresado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `egresado` (
  `CI` int(11) NOT NULL,
  `NombreEgresado` varchar(45) NOT NULL,
  `ApellidoEgresado` varchar(45) NOT NULL,
  `Tlf` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `direccion` varchar(45) NOT NULL,
  `FechaNacim` date DEFAULT NULL,
  `Carrera` varchar(45) NOT NULL,
  `preguntaSeg` varchar(45) NOT NULL,
  `respuestaSeg` varchar(45) NOT NULL,
  `Usuario_IDUsuario` int(11) NOT NULL,
  `Carrera_IDCarrera` int(11) NOT NULL,
  PRIMARY KEY (`CI`,`Usuario_IDUsuario`,`Carrera_IDCarrera`),
  UNIQUE KEY `FechaNacim_UNIQUE` (`FechaNacim`),
  KEY `fk_Egresado_Usuario1_idx` (`Usuario_IDUsuario`),
  KEY `fk_Egresado_Carrera1_idx` (`Carrera_IDCarrera`),
  CONSTRAINT `fk_Egresado_Carrera1` FOREIGN KEY (`Carrera_IDCarrera`) REFERENCES `carrera` (`IDCarrera`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Egresado_Usuario1` FOREIGN KEY (`Usuario_IDUsuario`) REFERENCES `usuario` (`IDUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `egresado`
--

LOCK TABLES `egresado` WRITE;
/*!40000 ALTER TABLE `egresado` DISABLE KEYS */;
INSERT INTO `egresado` VALUES (26138612,'milad','zaghab','123123123','asdasd@asdasd','asdasdasd','2017-12-19','1000','hola','chao',27,1000),(26138613,'diego','valdez','1231231234','asdasd@asdasd','qweqweqwe','2017-12-28','1000','hola','chao',28,1000),(26138687,'angel','pena','123456789123456','asdasd@asdasd','sdasdasdad','1987-09-24','1000','hola2','chao2',18,1000),(26138688,'miguel','obando','123423','asd@gmail.com','asdasdasd','1987-09-25','1000','hola','chao',21,1000),(26138689,'gustavo','rodriguez','123123','asdasd@asdasd','asdasfdfgad','1987-09-26','1001','hola','chao',22,1001),(26138690,'jose','moreno','041231123123','asdasd@asdasd','asdasdasd','1987-09-20','1000','hola','chao',23,1000),(26138691,'juan','ramirez','041231123123','asd@gmail.cpm','asdasdasd','1987-09-21','1001','hola','chao',24,1001),(26138692,'maria','perez','041231123123','asd@gmail.cpm','123123123','1987-09-23','1001','hola','chao',25,1001),(26138693,'jose','guarino','123123','asd@gmail.cpm','aasdasdasdasd','1987-08-24','1000','hola','chao',26,1000);
/*!40000 ALTER TABLE `egresado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periodoelectoral`
--

DROP TABLE IF EXISTS `periodoelectoral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `periodoelectoral` (
  `IDPE` varchar(20) NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date NOT NULL,
  `FechaIP` date NOT NULL,
  `FechaFP` date NOT NULL,
  `FechaIV` date NOT NULL,
  `FechaFV` date NOT NULL,
  `Estado` enum('I','P','V','X') NOT NULL,
  PRIMARY KEY (`IDPE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodoelectoral`
--

LOCK TABLES `periodoelectoral` WRITE;
/*!40000 ALTER TABLE `periodoelectoral` DISABLE KEYS */;
INSERT INTO `periodoelectoral` VALUES ('2','2017-10-04','2017-10-03','2017-10-04','2017-10-10','2017-10-03','2017-10-04','X'),('2016-2018','2017-12-04','2017-12-16','2017-12-05','2017-12-10','2017-12-11','2017-12-12','I');
/*!40000 ALTER TABLE `periodoelectoral` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postulacion`
--

DROP TABLE IF EXISTS `postulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postulacion` (
  `IDPostulacion` int(11) NOT NULL AUTO_INCREMENT,
  `CIEgresado` int(11) NOT NULL,
  `IDCargo1` int(11) NOT NULL,
  `IDPE1` varchar(20) NOT NULL,
  `ValidadaEscuela` tinyint(4) NOT NULL,
  `ValidadaCE` tinyint(4) NOT NULL,
  `Escalafon` varchar(45) NOT NULL,
  `Fotografia` varchar(128) NOT NULL,
  `Votos` int(11) NOT NULL DEFAULT '0',
  `principal` tinyint(4) NOT NULL DEFAULT '0',
  `suplente` tinyint(4) NOT NULL DEFAULT '0',
  `PartidoPolitico` varchar(100) NOT NULL DEFAULT 'Independiente',
  PRIMARY KEY (`IDPostulacion`),
  KEY `CIEgresado` (`CIEgresado`),
  KEY `IDPE1` (`IDPE1`),
  KEY `IDCargo1` (`IDCargo1`),
  CONSTRAINT `postulacion_ibfk_1` FOREIGN KEY (`CIEgresado`) REFERENCES `egresado` (`CI`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `postulacion_ibfk_2` FOREIGN KEY (`IDPE1`) REFERENCES `periodoelectoral` (`IDPE`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `postulacion_ibfk_3` FOREIGN KEY (`IDCargo1`) REFERENCES `cargo` (`IDCargo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postulacion`
--

LOCK TABLES `postulacion` WRITE;
/*!40000 ALTER TABLE `postulacion` DISABLE KEYS */;
INSERT INTO `postulacion` VALUES (8,26138687,1018,'2016-2018 ',1,1,'tres','FOTO',2,0,0,'unidad'),(11,26138693,1018,'2016-2018 ',0,0,'asdasd','FOTO',0,0,0,'asdasd'),(12,26138693,1020,'2016-2018 ',1,1,'asdasd','FOTO',0,0,0,'asdasd'),(13,26138688,1019,'2016-2018 ',1,1,'asasda','FOTO',2,0,0,'asdasd'),(14,26138688,1020,'2016-2018 ',1,1,'asdasd','FOTO',1,0,0,'asdasd'),(15,26138690,1018,'2016-2018 ',1,1,'asasd','FOTO',0,0,0,'asdasd'),(16,26138690,1019,'2016-2018 ',1,1,'asdasd','FOTO',0,0,0,'asdasd'),(17,26138690,1020,'2016-2018 ',0,0,'asdasd','FOTO',0,0,0,'asdasd'),(18,26138689,1018,'2016-2018 ',0,0,'asdasd','FOTO',0,0,0,'asdasd'),(19,26138689,1019,'2016-2018 ',0,0,'asdasd','FOTO',0,0,0,'asdasd'),(20,26138691,1018,'2016-2018 ',0,0,'sdasd','FOTO',0,0,0,'12312'),(21,26138691,1021,'2016-2018 ',0,0,'asdasdasd','FOTO',0,0,0,'asdasdasd'),(22,26138692,1018,'2016-2018 ',0,0,'asdasd','FOTO',0,0,0,'asdasd'),(24,26138692,1019,'2016-2018 ',0,0,'asdasdasd','FOTO',0,0,0,'asdasdasd'),(25,26138687,1020,'2016-2018 ',0,0,'asdasd','FOTO',0,0,0,'asdasd');
/*!40000 ALTER TABLE `postulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propuestacampana`
--

DROP TABLE IF EXISTS `propuestacampana`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `propuestacampana` (
  `IDPC` int(11) NOT NULL AUTO_INCREMENT,
  `Postulacion_IDPostulacion` int(11) NOT NULL,
  `prpuesta` varchar(45) NOT NULL,
  PRIMARY KEY (`IDPC`),
  KEY `fk_PropuestaCampana_Postulacion1_idx` (`Postulacion_IDPostulacion`),
  CONSTRAINT `fk_PropuestaCampana_Postulacion1` FOREIGN KEY (`Postulacion_IDPostulacion`) REFERENCES `postulacion` (`IDPostulacion`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propuestacampana`
--

LOCK TABLES `propuestacampana` WRITE;
/*!40000 ALTER TABLE `propuestacampana` DISABLE KEYS */;
INSERT INTO `propuestacampana` VALUES (10,8,'paz'),(11,8,'libertad'),(13,11,'asdasd'),(14,12,'asdasd'),(15,13,'asdasd'),(16,14,'asdasd'),(17,15,'asdasd'),(18,16,'asdad'),(19,17,'asdasd'),(20,18,'asdasd'),(21,19,'asdasd'),(22,20,'asdasd'),(23,21,'asdasd'),(25,22,'asdasdad'),(26,24,'asdasdad');
/*!40000 ALTER TABLE `propuestacampana` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `retiropostulacion`
--

DROP TABLE IF EXISTS `retiropostulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `retiropostulacion` (
  `IDRetiro` int(11) NOT NULL AUTO_INCREMENT,
  `IDPostulacion` int(11) NOT NULL,
  `Causa` varchar(45) NOT NULL,
  `FechaRetiro` date NOT NULL,
  PRIMARY KEY (`IDRetiro`),
  KEY `IDPostulacion_idx` (`IDPostulacion`),
  CONSTRAINT `IDPostulacion` FOREIGN KEY (`IDPostulacion`) REFERENCES `postulacion` (`IDPostulacion`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retiropostulacion`
--

LOCK TABLES `retiropostulacion` WRITE;
/*!40000 ALTER TABLE `retiropostulacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `retiropostulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `IDUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `NombreUsu` varchar(45) NOT NULL,
  `ClaveUsu` varchar(45) NOT NULL,
  `Cargo` int(11) NOT NULL,
  PRIMARY KEY (`IDUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'comi','123',1),(2,'dir','123',2),(4,'admin','123',4),(18,'egre','123',3),(21,'miguel','123',3),(22,'gustavo','123',3),(23,'jose','123',3),(24,'juan','123',3),(25,'maria','123',3),(26,'guari','123',3),(27,'milad','asd',3),(28,'diego','1234',3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votacion`
--

DROP TABLE IF EXISTS `votacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votacion` (
  `idVotacion` int(11) NOT NULL AUTO_INCREMENT,
  `IDPE` varchar(20) DEFAULT NULL,
  `IDVotante` int(11) DEFAULT NULL,
  PRIMARY KEY (`idVotacion`),
  KEY `IDPE_idx` (`IDPE`),
  KEY `IDPostulacion_idx` (`IDVotante`),
  CONSTRAINT `votacion_ibfk_1` FOREIGN KEY (`IDPE`) REFERENCES `periodoelectoral` (`IDPE`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `votacion_ibfk_2` FOREIGN KEY (`IDVotante`) REFERENCES `usuario` (`IDUsuario`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votacion`
--

LOCK TABLES `votacion` WRITE;
/*!40000 ALTER TABLE `votacion` DISABLE KEYS */;
INSERT INTO `votacion` VALUES (2,'2016-2018',18),(16,'2016-2018',26),(17,'2016-2018',21);
/*!40000 ALTER TABLE `votacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-19  9:41:55
