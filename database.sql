-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Enseignant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Enseignant` (
  `matricule` INT NOT NULL,
  `CIN` VARCHAR(45) NOT NULL,
  `nom` VARCHAR(45) NULL,
  `prenom` VARCHAR(45) NULL,
  `emal` VARCHAR(45) NOT NULL,
  `motdepasse` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`matricule`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`matiere`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`matiere` (
  `codematiere` INT NOT NULL,
  `nommatiere` VARCHAR(45) NOT NULL,
  `Enseignant_matricule` INT NOT NULL,
  PRIMARY KEY (`codematiere`),
  INDEX `fk_matiere_Enseignant_idx` (`Enseignant_matricule` ASC) VISIBLE,
  CONSTRAINT `fk_matiere_Enseignant`
    FOREIGN KEY (`Enseignant_matricule`)
    REFERENCES `mydb`.`Enseignant` (`matricule`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`UE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`UE` (
  `codeue` INT NOT NULL,
  `nomue` VARCHAR(45) NULL,
  `matiere_codematiere` INT NOT NULL,
  PRIMARY KEY (`codeue`),
  INDEX `fk_UE_matiere1_idx` (`matiere_codematiere` ASC) VISIBLE,
  CONSTRAINT `fk_UE_matiere1`
    FOREIGN KEY (`matiere_codematiere`)
    REFERENCES `mydb`.`matiere` (`codematiere`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`classe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`classe` (
  `codeclasse` INT NOT NULL,
  `nomclasse` VARCHAR(45) NOT NULL,
  `UE_codeue` INT NOT NULL,
  PRIMARY KEY (`codeclasse`, `UE_codeue`),
  INDEX `fk_classe_UE1_idx` (`UE_codeue` ASC) VISIBLE,
  CONSTRAINT `fk_classe_UE1`
    FOREIGN KEY (`UE_codeue`)
    REFERENCES `mydb`.`UE` (`codeue`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Etudiant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Etudiant` (
  `idEtudiant` INT NOT NULL,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(45) NOT NULL,
  `classe_codeclasse` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `motdepasse` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEtudiant`),
  INDEX `fk_Etudiant_classe1_idx` (`classe_codeclasse` ASC) VISIBLE,
  CONSTRAINT `fk_Etudiant_classe1`
    FOREIGN KEY (`classe_codeclasse`)
    REFERENCES `mydb`.`classe` (`codeclasse`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Seance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Seance` (
  `idSeance` INT NOT NULL,
  `datedebut` DATETIME NOT NULL,
  `dateFin` DATETIME NOT NULL,
  `screenshare` TINYINT NULL,
  `Enseignant_matricule` INT NOT NULL,
  `NoteSeance` INT NULL,
  `NomSeance` VARCHAR(45) NOT NULL,
  `classe_codeclasse` INT NOT NULL,
  PRIMARY KEY (`idSeance`),
  INDEX `fk_Seance_Enseignant1_idx` (`Enseignant_matricule` ASC) VISIBLE,
  INDEX `fk_Seance_classe1_idx` (`classe_codeclasse` ASC) VISIBLE,
  CONSTRAINT `fk_Seance_Enseignant1`
    FOREIGN KEY (`Enseignant_matricule`)
    REFERENCES `mydb`.`Enseignant` (`matricule`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Seance_classe1`
    FOREIGN KEY (`classe_codeclasse`)
    REFERENCES `mydb`.`classe` (`codeclasse`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`ParticiperSeance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ParticiperSeance` (
  `avgpresencetime` VARCHAR(45) NOT NULL,
  `userterminaltype` VARCHAR(45) NULL,
  `emailused` VARCHAR(45) NULL,
  `ParticiperSeancecol` VARCHAR(45) NOT NULL,
  `localarrea` VARCHAR(45) NULL,
  `idEtudiant` INT NOT NULL,
  `idSeance` INT NOT NULL,
  INDEX `fk_ParticiperSeance_Etudiant1_idx` (`idEtudiant` ASC) VISIBLE,
  INDEX `fk_ParticiperSeance_Seance1_idx` (`idSeance` ASC) VISIBLE,
  CONSTRAINT `fk_ParticiperSeance_Etudiant1`
    FOREIGN KEY (`idEtudiant`)
    REFERENCES `mydb`.`Etudiant` (`idEtudiant`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ParticiperSeance_Seance1`
    FOREIGN KEY (`idSeance`)
    REFERENCES `mydb`.`Seance` (`idSeance`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Notes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Notes` (
  `Note` INT NULL,
  `Seance_idSeance` INT NOT NULL,
  `Commentaire` VARCHAR(100) NULL,
  PRIMARY KEY (`Seance_idSeance`),
  INDEX `fk_Notes_Seance1_idx` (`Seance_idSeance` ASC) VISIBLE,
  CONSTRAINT `fk_Notes_Seance1`
    FOREIGN KEY (`Seance_idSeance`)
    REFERENCES `mydb`.`Seance` (`idSeance`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `mydb`;

DELIMITER $$
USE `mydb`$$
CREATE  TRIGGER TNOTESEANCE
	AFTER INSERT ON Notes /* Cette ligne permet au trigger de s'executer juste aprés l'insertion d'une note*/
	FOR EACH ROW 
	BEGIN /* La ou sera les requetes que le triggers declenchera*/
	DECLARE note_avg float;/* on declare une variable pour pouvoir stcoker le resultat de la moyenne de la note */
	 SELECT avg(Note) INTO note_avg/* on stocke la moyenne dans la variable note_avg*/
		FROM Notes  WHERE Notes.Seance_idSeance = NEW.Seance_idSeance ; /*Le NEW permet de referencier l'id de la seance que l'on vient d'ajjouter la note*/
	UPDATE Seance set NoteSeance = note_avg  /*On met a jour les notes de la seance*/
	where Seance.idSeance = NEW.Seances_idSeance ;
	END #$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
