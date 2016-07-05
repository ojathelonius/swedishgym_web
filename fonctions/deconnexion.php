<!-- PROJET VISUALISATION 2
VERSION 1.0 - 08/06/2015 -->

<?php
  session_start() ;
  //destruction de toutes les variable de sessions
  session_unset() ;
  //destruction de la session
  session_destroy() ;
 
  header("location: ../connexion.php") ;
?>