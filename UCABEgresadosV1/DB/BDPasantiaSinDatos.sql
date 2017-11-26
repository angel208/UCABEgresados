-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema ucabegresado
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ucabegresado
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ucabegresado` DEFAULT CHARACTER SET utf8 ;
USE `ucabegresado` ;

-- -----------------------------------------------------
-- Table `ucabegresado`.`cargo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`cargo` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`cargo` (
  `IDCargo` INT(11) NOT NULL AUTO_INCREMENT,
  `NombreCargo` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDCargo`))
ENGINE = InnoDB
AUTO_INCREMENT = 1014
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`carrera`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`carrera` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`carrera` (
  `IDCarrera` INT(11) NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDCarrera`))
ENGINE = InnoDB
AUTO_INCREMENT = 1002
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`periodoelectoral`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`periodoelectoral` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`periodoelectoral` (
  `IDPE` VARCHAR(20) NOT NULL,
  `FechaInicio` DATE NOT NULL,
  `FechaFin` DATE NOT NULL,
  `FechaIP` DATE NOT NULL,
  `FechaFP` DATE NOT NULL,
  `FechaIV` DATE NOT NULL,
  `FechaFV` DATE NOT NULL,
  `Estado` ENUM('I', 'P', 'V', 'X') NOT NULL,
  PRIMARY KEY (`IDPE`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`cargosxcarrera`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`cargosxcarrera` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`cargosxcarrera` (
  `Carrera_IDCarrera` INT(11) NOT NULL,
  `Cargo_IDCargo` INT(11) NOT NULL,
  `PeriodoElectoral_IDPE` VARCHAR(20) NOT NULL,
  `Conformado` TINYINT(4) NOT NULL,
  PRIMARY KEY (`Carrera_IDCarrera`, `Cargo_IDCargo`, `PeriodoElectoral_IDPE`),
  INDEX `fk_CargosxCarrera_Cargo1_idx` (`Cargo_IDCargo` ASC),
  INDEX `fk_CargosxCarrera_PeriodoElectoral1_idx` (`PeriodoElectoral_IDPE` ASC),
  CONSTRAINT `fk_CargosxCarrera_Cargo1`
    FOREIGN KEY (`Cargo_IDCargo`)
    REFERENCES `ucabegresado`.`cargo` (`IDCargo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_CargosxCarrera_Carrera1`
    FOREIGN KEY (`Carrera_IDCarrera`)
    REFERENCES `ucabegresado`.`carrera` (`IDCarrera`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_CargosxCarrera_PeriodoElectoral1`
    FOREIGN KEY (`PeriodoElectoral_IDPE`)
    REFERENCES `ucabegresado`.`periodoelectoral` (`IDPE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`usuario` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`usuario` (
  `IDUsuario` INT(11) NOT NULL AUTO_INCREMENT,
  `NombreUsu` VARCHAR(45) NOT NULL,
  `ClaveUsu` VARCHAR(45) NOT NULL,
  `Cargo` INT(11) NOT NULL,
  PRIMARY KEY (`IDUsuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`egresado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`egresado` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`egresado` (
  `CI` INT(11) NOT NULL,
  `NombreEgresado` VARCHAR(45) NOT NULL,
  `ApellidoEgresado` VARCHAR(45) NOT NULL,
  `Tlf` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `FechaNacim` DATE NULL DEFAULT NULL,
  `Carrera` VARCHAR(45) NOT NULL,
  `preguntaSeg` VARCHAR(45) NOT NULL,
  `respuestaSeg` VARCHAR(45) NOT NULL,
  `Usuario_IDUsuario` INT(11) NOT NULL,
  `Carrera_IDCarrera` INT(11) NOT NULL,
  PRIMARY KEY (`CI`, `Usuario_IDUsuario`, `Carrera_IDCarrera`),
  UNIQUE INDEX `FechaNacim_UNIQUE` (`FechaNacim` ASC),
  INDEX `fk_Egresado_Usuario1_idx` (`Usuario_IDUsuario` ASC),
  INDEX `fk_Egresado_Carrera1_idx` (`Carrera_IDCarrera` ASC),
  CONSTRAINT `fk_Egresado_Carrera1`
    FOREIGN KEY (`Carrera_IDCarrera`)
    REFERENCES `ucabegresado`.`carrera` (`IDCarrera`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Egresado_Usuario1`
    FOREIGN KEY (`Usuario_IDUsuario`)
    REFERENCES `ucabegresado`.`usuario` (`IDUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`datosegresado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`datosegresado` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`datosegresado` (
  `CIEgresado` INT(11) NOT NULL,
  `CorreoUCAB` VARCHAR(45) NOT NULL,
  `AnoIngreso` INT(11) NOT NULL,
  `AnoEgreso` INT(11) NOT NULL,
  `Eficiencia1` TINYINT(4) NOT NULL,
  PRIMARY KEY (`CIEgresado`),
  CONSTRAINT `CIEgresado`
    FOREIGN KEY (`CIEgresado`)
    REFERENCES `ucabegresado`.`egresado` (`CI`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`postulacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`postulacion` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`postulacion` (
  `IDPostulacion` INT(11) NOT NULL AUTO_INCREMENT,
  `CIEgresado` INT(11) NOT NULL,
  `IDCargo1` INT(11) NOT NULL,
  `IDPE1` VARCHAR(20) NOT NULL,
  `ValidadaEscuela` TINYINT(4) NOT NULL,
  `ValidadaCE` TINYINT(4) NOT NULL,
  `Escalafon` VARCHAR(45) NOT NULL,
  `Fotografia` VARCHAR(128) NOT NULL,
  `Votos` INT(11) NOT NULL DEFAULT '0',
  `principal` TINYINT(4) NOT NULL DEFAULT '0',
  `suplente` TINYINT(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`IDPostulacion`),
  INDEX `CIEgresado` (`CIEgresado` ASC),
  INDEX `IDPE1` (`IDPE1` ASC),
  INDEX `IDCargo1` (`IDCargo1` ASC),
  CONSTRAINT `postulacion_ibfk_1`
    FOREIGN KEY (`CIEgresado`)
    REFERENCES `ucabegresado`.`egresado` (`CI`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `postulacion_ibfk_2`
    FOREIGN KEY (`IDPE1`)
    REFERENCES `ucabegresado`.`periodoelectoral` (`IDPE`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `postulacion_ibfk_3`
    FOREIGN KEY (`IDCargo1`)
    REFERENCES `ucabegresado`.`cargo` (`IDCargo`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`propuestacampana`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`propuestacampana` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`propuestacampana` (
  `IDPC` INT(11) NOT NULL AUTO_INCREMENT,
  `Postulacion_IDPostulacion` INT(11) NOT NULL,
  `prpuesta` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDPC`),
  INDEX `fk_PropuestaCampana_Postulacion1_idx` (`Postulacion_IDPostulacion` ASC),
  CONSTRAINT `fk_PropuestaCampana_Postulacion1`
    FOREIGN KEY (`Postulacion_IDPostulacion`)
    REFERENCES `ucabegresado`.`postulacion` (`IDPostulacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`retiropostulacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`retiropostulacion` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`retiropostulacion` (
  `IDRetiro` INT(11) NOT NULL AUTO_INCREMENT,
  `IDPostulacion` INT(11) NOT NULL,
  `Causa` VARCHAR(45) NOT NULL,
  `FechaRetiro` DATE NOT NULL,
  PRIMARY KEY (`IDRetiro`),
  INDEX `IDPostulacion_idx` (`IDPostulacion` ASC),
  CONSTRAINT `IDPostulacion`
    FOREIGN KEY (`IDPostulacion`)
    REFERENCES `ucabegresado`.`postulacion` (`IDPostulacion`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ucabegresado`.`votacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ucabegresado`.`votacion` ;

CREATE TABLE IF NOT EXISTS `ucabegresado`.`votacion` (
  `idVotacion` INT(11) NOT NULL AUTO_INCREMENT,
  `IDPE` VARCHAR(20) NULL DEFAULT NULL,
  `IDPostulacion` INT(11) NULL DEFAULT NULL,
  `TotalVotos` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idVotacion`),
  INDEX `IDPE_idx` (`IDPE` ASC),
  INDEX `IDPostulacion_idx` (`IDPostulacion` ASC),
  CONSTRAINT `votacion_ibfk_1`
    FOREIGN KEY (`IDPE`)
    REFERENCES `ucabegresado`.`periodoelectoral` (`IDPE`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `votacion_ibfk_2`
    FOREIGN KEY (`IDPostulacion`)
    REFERENCES `ucabegresado`.`postulacion` (`IDPostulacion`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
