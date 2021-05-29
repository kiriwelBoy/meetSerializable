CREATE DATABASE GestionTrigger;
use GestionTrigger;

CREATE TABLE Emploi(
numEmploi integer primary key,
intituleEmploi varchar(30),
salaireMoyen integer
);

CREATE TABLE Employe (
numEmploye integer primary key ,
nomEmploye varchar(30),
adrEmploye varchar(30),
salaire integer,
numEmploi integer,
constraint foreign key fk_emp (numEmploi)  references Emploi(numemploi)
);


CREATE  TRIGGER MoySalaire
AFTER INSERT ON Emploi
 
FOR EACH ROW 
BEGIN
	SELECT AVG(salaire) into moysal from Employe where 
			numEmploi = NEW.numEmploi;
        
	UPDATE Emploi set salaireMoyen = moysal   ;
    
END|