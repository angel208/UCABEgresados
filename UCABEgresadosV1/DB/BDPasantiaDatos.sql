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
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES (1000,'Consejo Extensión','Consejo Extensión'),(1001,'Consejo de Escuela Informática','Consejo de Escuela Informática'),(1002,'Consejo Universitario',''),(1011,'asd1','asdasd'),(1012,'asdasd','123'),(1013,'xd','123');
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cargosxcarrera`
--

LOCK TABLES `cargosxcarrera` WRITE;
/*!40000 ALTER TABLE `cargosxcarrera` DISABLE KEYS */;
INSERT INTO `cargosxcarrera` VALUES (1000,1000,1,0),(1000,1001,1,0),(1000,1002,1,0),(1001,1000,1,0),(1001,1002,1,0);
/*!40000 ALTER TABLE `cargosxcarrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `carrera`
--

LOCK TABLES `carrera` WRITE;
/*!40000 ALTER TABLE `carrera` DISABLE KEYS */;
INSERT INTO `carrera` VALUES (1000,'Ingeniería Infomática','Ingenieria Informatica'),(1001,'Ingeniería Civil','Ingeniería Civil');
/*!40000 ALTER TABLE `carrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `datosegresado`
--

LOCK TABLES `datosegresado` WRITE;
/*!40000 ALTER TABLE `datosegresado` DISABLE KEYS */;
/*!40000 ALTER TABLE `datosegresado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `egresado`
--

LOCK TABLES `egresado` WRITE;
/*!40000 ALTER TABLE `egresado` DISABLE KEYS */;
INSERT INTO `egresado` VALUES (1111,'juan','jose','04241234567','juanjose@gmail.com','villa africana puerto ordaz','1990-01-01','1000','chao','chao',5,1000),(2222,'julia','bolso','04249181123','juliabolso@gmail.com','las lomas puerto ordaz','1980-01-20','1000','jejeje','jejeje',6,1000),(3333,'jorge','montilla','04261231231','jorgemonti@gmail.com','moreno de mendoza ','1970-05-09','1000','chavez','murio',7,1000),(4444,'ricky','ricon','0424989898','rickymoney@gmail.com','los altos ','2000-07-01','1000','money','maker',8,1000),(5555,'cora','urdaneta','041411111','maurdane@gmail.com','jardin levante puertoordaz','1970-01-07','1000','a ver','chicos',9,1000),(6666,'franklin','bello','04141231233','fbello@gmail.com','puerto ordaz estado bolivar','1966-01-03','1000','gym?','yuca',10,1000),(26138687,'Angel','PeÃ±a','0424-9081707','angel_fp90@hotmail.com','Terrazas del Caroni','1996-08-20','1000','hola','',3,1000);
/*!40000 ALTER TABLE `egresado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `periodoelectoral`
--

LOCK TABLES `periodoelectoral` WRITE;
/*!40000 ALTER TABLE `periodoelectoral` DISABLE KEYS */;
INSERT INTO `periodoelectoral` VALUES (1,'2017-10-27','2017-10-28','2017-10-28','2017-10-28','2017-10-28','2017-10-28','I'),(2,'2017-10-04','2017-10-03','2017-10-04','2017-10-10','2017-10-03','2017-10-04','X');
/*!40000 ALTER TABLE `periodoelectoral` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `postulacion`
--

LOCK TABLES `postulacion` WRITE;
/*!40000 ALTER TABLE `postulacion` DISABLE KEYS */;
INSERT INTO `postulacion` VALUES (1,1111,1,1000,1,0,'nose','fofofofo',2,1,0),(2,2222,1,1000,1,1,'nose1','fotofo1',2,0,1),(3,3333,1,1000,1,0,'nose2','foto2',0,0,0),(4,4444,1,1001,1,1,'nose','foto',3,0,0);
/*!40000 ALTER TABLE `postulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `propuestacampana`
--

LOCK TABLES `propuestacampana` WRITE;
/*!40000 ALTER TABLE `propuestacampana` DISABLE KEYS */;
INSERT INTO `propuestacampana` VALUES (1,1,'bajar los precios del nestea'),(2,1,'bajar los precios de las empandas'),(3,1,'ahh si luchar por los derechos de los estudia'),(4,2,'poder lograr becas para los estudiantes de ba'),(5,2,'conseguir almuerzo gratis'),(6,2,'defender el derecho de todos');
/*!40000 ALTER TABLE `propuestacampana` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `retiropostulacion`
--

LOCK TABLES `retiropostulacion` WRITE;
/*!40000 ALTER TABLE `retiropostulacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `retiropostulacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'comi','123',1),(2,'dir','123',2),(3,'egre','123',3),(4,'admin','123',4),(5,'jjperez','123',3),(6,'asd123','123',3),(7,'qwe123','123',3),(8,'zxc123','123',3),(9,'cvb123','123',3),(10,'dfg123','123',3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `votacion`
--

LOCK TABLES `votacion` WRITE;
/*!40000 ALTER TABLE `votacion` DISABLE KEYS */;
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

-- Dump completed on 2017-11-13 12:25:43
