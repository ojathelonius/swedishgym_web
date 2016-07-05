<!-- PROJET VISUALISATION 2
VERSION 1.0 - 08/06/2015 -->

<?php
session_start();
if(!isset($_SESSION["login"]) || $_SESSION["login"] == "")
{
  header("location: connexion.php") ;
}?>
<!DOCTYPE html>
<html lang="fr">

<head>
  <link rel="Shortcut Icon" type="image/gif" href="https://design.gymsuedoise.com/USER20160529/favicon.gif" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Gym Suédoise - Visualisation n°2</title>

  <!-- ANGULAR MATERIAL CSS -->
  <link rel="stylesheet" href="css/angular-material.css">

  <!-- ANGULAR MATERIAL JS -->
  <script type="text/javascript" src="js/lib/angular.js"></script>
  <script type="text/javascript" src="js/lib/angular-sanitize.js"></script>
  <script type="text/javascript" src="js/lib/angular-locale_fr-fr.js"></script>
  <script type="text/javascript" src="js/lib/angular-animate.min.js"></script>
  <script type="text/javascript" src="js/lib/angular-route.min.js"></script>
  <script type="text/javascript" src="js/lib/angular-aria.min.js"></script>
  <script type="text/javascript" src="js/lib/angular-messages.min.js"></script>
  <script type="text/javascript" src="js/lib/svg-assets-cache.js"></script>


  <!-- Leaflet (carteCtrl) -->
  <link rel="stylesheet" href="css/leaflet.css" />
  <link rel="stylesheet" href="css/leaflet.awesome-markers.css">
  <script src="js/lib/leaflet.js"></script>
  <script src="js/lib/angular-leaflet-directive.min.js"></script>
  <script src="js/lib/leaflet.awesome-markers.min.js"></script>

  <!-- Chart.JS -->
  <script src="bower_components/Chart.js/dist/Chart.js"></script>
  

  <!-- Moment.JS -->
  <script src="js/lib/moment.min.js"></script>

  <!-- Bootstrap Core CSS et add-ons -->
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <link href="css/font-awesome.min.css" rel="stylesheet">

  <!-- Custom CSS -->
  <link href="css/simple-sidebar.css" rel="stylesheet">
  <link rel="stylesheet" href="css/design.css">

  <!-- Controllers -->
  <script type="text/javascript" src="js/app.js"></script>
  <script type="text/javascript" src="js/mainCtrl.js"></script>
  <script type="text/javascript" src="js/carteCtrl.js"></script>
  <script type="text/javascript" src="js/statsCtrl.js"></script>
  <script type="text/javascript" src="js/calendrierCtrl.js"></script>
  <script type="text/javascript" src="js/annuaireCtrl.js"></script>
</head>

<body ng-app="mainApp">
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="row">
      <div class="col-xs-6">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">
             <div class="media">
               <span class="media-left" ng-click="toggleMenu()">
                <img src="images/sigle-GS.png" alt="Logo de la Gym Suédoise" id="sigle-GS"/>
              </span>
              <div class="media-body">
                <div class="media-heading" id="logo-titre">
                  <span class="text-orange">GYM</span><span class="text-white">SUÉDOISE</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="col-xs-6">
      <div id="navbar" class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right" id="profil-gest">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" id="text-gest">
              <span class="glyphicon glyphicon-user"></span> 
              <strong>Gestionnaire</strong>
              <span class="glyphicon glyphicon-chevron-down"></span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <div class="navbar-login">
                  <div class="row">
                    <div class="col-lg-4">
                      <p class="text-center">
                        <span class="glyphicon glyphicon-user icon-size"></span>
                      </p>
                    </div>
                    <div class="col-lg-8">
                      <p class="text-left"><strong>Maeva</strong></p>
                      <p class="text-left medium">maeva@gymsuedoise.com</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="divider"></li>
              <li>
                <div class="navbar-login navbar-login-session">
                  <div class="row">
                    <div class="col-md-12">
                      <p>
                       <form method="post" action="fonctions/deconnexion.php">
                        <input type="submit" class="btn btn-default btn-block" id="bouton-deconnect" value="Déconnexion">
                      </form>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</div>
</nav>

<div id="wrapper" ng-controller="mainCtrl">
  <!-- Sidebar -->
  <div id="sidebar-wrapper"  >
    <ul class="sidebar-nav">
      <li class="sidebar-brand">
        <h3 class="text-center">
          Filtres
        </h3>
      </li>
      <li>
       <a ng-click="changerRootScope('carte.html')" ng-class="(currentPage=='carte.html')?'currentMenu':''">
        <span class="glyphicon glyphicon-map-marker"></span>
        <div class="chip" ng-class="(tagGeo==tagGeoDefaut)?'chip-menu':'chip-filtre'">
          <div class="tag">{{tagGeo}}</div>
          <i class="material-icons"  ng-click="resetCarte($event)"  ng-hide="tagGeo==tagGeoDefaut">close</i>
        </div>
      </a>
    </li>
    <li>
      <a ng-click="changerRootScope('calendrier.html')" ng-class="(currentPage=='calendrier.html')?'currentMenu':''">
       <span class="glyphicon glyphicon-calendar"></span>
       <div class="chip" ng-class="(tagTemps==tagTempsDefaut)?'chip-menu':'chip-filtre'">
        <div class="tag">{{tagTemps}}</div>
        <i class="material-icons" ng-click="resetCalendar($event)" ng-hide="tagTemps==tagTempsDefaut">close</i>
      </div>                     
    </a>
  </li>
  <li>
    <a ng-click="changerRootScope('statistiques.html')" ng-class="(currentPage=='statistiques.html')?'currentMenu':''">
      <span class="glyphicon glyphicon-stats"></span>
      <div class="chip" ng-class="(tagStats==tagStatsDefaut)?'chip-menu':'chip-filtre'">
        <div class="tag">{{tagStats}}</div>
        <i class="material-icons"  ng-click="resetStats($event)"  ng-hide="tagStats==tagStatsDefaut">close</i>
      </div>
    </a>
  </li>
  <li>
    <a ng-click="changerRootScope('annuaire.html')" ng-class="(currentPage=='annuaire.html')?'currentMenu':''">
     <span class="glyphicon glyphicon-user"></span>
     <div class="chip" ng-class="(tagStaff==tagStaffDefaut)?'chip-menu':'chip-filtre'">
      <div class="tag">{{tagStaff}}</div>
      <i class="material-icons" ng-click="resetStaff($event)" ng-hide="tagStaff==tagStaffDefaut">close</i>
    </div> 
  </a>
</li>

<li>

</li>
</ul>
</div>


<div id="page-content-wrapper">
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <ng-include src="currentPage"></ng-include>
      </div>
    </div>
  </div>
</div>

<!-- jQuery -->
<script src="js/lib/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="js/lib/bootstrap.min.js"></script>

</body>

</html>
