<!-- PROJET VISUALISATION 2
VERSION 1.0 - 08/06/2015 -->

<?php 
// Semblant de connexion
session_start();
$_SESSION["login"] = 'maeva'; 
header('Location: ../index.php');
?>