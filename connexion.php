<!-- PROJET VISUALISATION 2
VERSION 1.0 - 08/06/2015 -->

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
  <!-- Bootstrap Core CSS et add-ons -->
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <link href="css/font-awesome.min.css" rel="stylesheet">
  <!-- Custom CSS -->
  <link href="css/simple-sidebar.css" rel="stylesheet">
  <link rel="stylesheet" href="css/login_design.css">
</head>
<body>
  <div id="main_wrapper">

    <div class="container">
      <div class="card card-container">
        <div class="text-center">
        <img id="logo-GS" src="images/logo-GS.png" alt="Logo de la Gym Suédoise"/>
        </div>
        <form class="form-signin"  action="fonctions/fake_connexion.php">
          <span id="reauth-email" class="reauth-email"></span>
          <input type="email" id="inputEmail" class="form-control" placeholder="Adresse e-mail" required autofocus>
          <input type="password" id="inputPassword" class="form-control" placeholder="Mot de passe" required>
          <button class="btn btn-lg btn-primary btn-block btn-signin">Connexion</button>
        </form>
      </div>
    </div>
  </div>
</body>

</html>
