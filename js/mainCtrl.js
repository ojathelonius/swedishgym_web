// PROJET VISUALISATION 2
// VERSION 1.0 - 08/06/2015

// Controller principal, contrôlant le menu ainsi que la page entière de manière générale (le conteneur)
angular.module('mainApp').controller('mainCtrl', function ($scope, $rootScope, $log, $http, FiltreService, FiltreGeo, FiltreTempo, FiltreConflit, FiltreIntensite, FiltreStaff) {
    // Initialisation du filtre par défaut
    filtreGeo = new FiltreGeo('','','','');
    filtreTempo = new FiltreTempo('');
    filtreConflit = new FiltreConflit('');
    filtreIntensite = new FiltreIntensite('');
    filtreStaff = new FiltreStaff('','','','');
    filtreService = new FiltreService(filtreGeo, filtreTempo, filtreConflit, FiltreStaff, FiltreIntensite);


    // ONGLETS
    var croixTagCarte = document.getElementsByClassName("material-icons")[0];
    var croixTagTemps = document.getElementsByClassName("material-icons")[1];
    var croixTagStats = document.getElementsByClassName("material-icons")[2];

    $rootScope.currentPage= 'calendrier.html';
    $scope.changerRootScope = function(target){
        $rootScope.currentPage = target;
    };

    $rootScope.tagGeoDefaut = "Carte";
    $rootScope.tagGeo = $rootScope.tagGeoDefaut;
    
    $scope.resetCarte = function($event){
        console.log('test');
        $rootScope.tagGeo = $rootScope.tagGeoDefaut;
       // Retrait du filtre geo
       filtreGeo.retirerTout();
       $rootScope.$emit('retraitFiltre');
   };

   // Toggle du menu
   $rootScope.toggleMenu = function(){
    $("#wrapper").toggleClass("toggled");
}

    // CALENDRIER
    var f = new Date(new Date().getFullYear()-1, 8, 1, 0, 0, 0, 0);
    var t = new Date(f.getTime());
    t.setFullYear(f.getFullYear()+1);
    /*$rootScope.tagTempsDefaut = f.getFullYear()+"/"+(f.getFullYear()+1);*/
    $rootScope.tagTempsDefaut = "Planning"
    $rootScope.tagTemps = $rootScope.tagTempsDefaut;
    $rootScope.filArianeCalendrier = [{title:$rootScope.tagTemps, from:f, to:t}];

    $scope.resetCalendar = function($event){
        $rootScope.filArianeCalendrier = $rootScope.filArianeCalendrier.slice(0, 1);
    };


    // STATISTIQUES
    $rootScope.tagStatsDefaut = "Statistiques";
    $rootScope.tagStats = $rootScope.tagStatsDefaut;

    $scope.resetStats = function($event){
        $rootScope.tagStats = "Statistiques";
        filtreIntensite.intensite = '';
        filtreConflit.conflit = '';
        $rootScope.$emit('retraitStats');

    };
    
        // ANNUAIRE
    $rootScope.tagStaffDefaut = "Équipe";
    $rootScope.tagStaff = $rootScope.tagStaffDefaut;
    $rootScope.personnesSelectionnees = [];
    $rootScope.personneRecherchee = "";

    $scope.resetStaff = function($event){
        $rootScope.personnesSelectionnees = [];
        $rootScope.tagStaff = $rootScope.tagStaffDefaut;

        filtreStaff.staff = '';
    };

});