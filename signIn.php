<?php
    if(isset($_POST["signIn"])){
        $firstName = $_POST["firstName"];
        $lastName = $_POST["lastName"];
        $mailAdress = $_POST["mailAdress"];
        $password = sha1($_POST["password"]);
        $con=mysqli_connect("localhost", "Meet_Course_Analyzer", "passer", "MeetCourseAnalyzer");
        $insertRequest = "INSERT INTO Professeur (NomProf , PrenomProf , Email , MotDePass) VALUES ('".$firstName."' , '".$lastName."' , '".$mailAdress."' , '".$password."');";
        if (mysqli_query($con,$insertRequest))
        echo "zell";
        else
        echo "woll";
    }else
    echo "coucou";
?>