// PROJET VISUALISATION 2
// VERSION 1.0 - 08/06/2015

// Controller de la page calendrier
angular.module('mainApp').controller('calendrierCtrl', function ($scope, $rootScope, $log, $http, FiltreService) {

	$scope.Math = window.Math;
	updateTiles();

	$scope.$watch('filArianeCalendrier.length', 
		function(newValue, oldValue){
			if (newValue != oldValue) {
				updateTiles();
			}
		}
		);


	$scope.zoomCalendar = function(tile, changeMonth) {

		if (changeMonth) {
			var a = new Date(tile.from.getFullYear(), tile.from.getMonth(), 1, 0, 0, 0, 0);
			var b = new Date(a.getTime());
			b.setMonth(a.getMonth()+1);
			var titre = a.toLocaleString("fr-fr", { month: "long" }).capitalizeFirstLetter();

			$rootScope.filArianeCalendrier[2] = {title:titre, from:a, to:b};
			updateTiles();
		}
		else {
			$rootScope.filArianeCalendrier.push({title:tile.title, from:tile.from, to:tile.to});
		}
	};


	$scope.unzoomCalendar = function(index) {
		$rootScope.filArianeCalendrier = $rootScope.filArianeCalendrier.slice(0, index+1);
	};

	$scope.goToCarte = function(classroom_id){
		filtreGeo.salle = classroom_id;
		$rootScope.currentPage= 'carte.html';
	};

	function updateTiles() {

		$scope.currentTile = $rootScope.filArianeCalendrier[$rootScope.filArianeCalendrier.length-1];
		var start = $scope.currentTile.from;
		var end = $scope.currentTile.to;
		var zoom = $rootScope.filArianeCalendrier.length;
		$scope.tiles = [];
		$scope.coursDuJour = [];
		$scope.nbConflitsMax = 0;

		switch(zoom) {
	        case 1: // Affichage des périodes de l'année
	        $rootScope.tagTemps = $rootScope.tagTempsDefaut;

	        var a = new Date(start.getFullYear(), 8, 1, 0, 0, 0, 0);
	        var b = new Date(start.getFullYear()+1, 0, 1, 0, 0, 0, 0);
	        $scope.tiles.push({title:"Semestre d'automne "+a.getFullYear(), from:a, to:b, nbCours:0, nbProfs:0, nbConflits:0, disabled:false});

	        var a = new Date(start.getFullYear()+1, 0, 1, 0, 0, 0, 0);
	        var b = new Date(start.getFullYear()+1, 6, 1, 0, 0, 0, 0);
	        $scope.tiles.push({title:"Semestre de printemps "+a.getFullYear(), from:a, to:b, nbCours:0, nbProfs:0, nbConflits:0, disabled:false});

	        var a = new Date(start.getFullYear()+1, 6, 1, 0, 0, 0, 0);
	        var b = new Date(start.getFullYear()+1, 8, 1, 0, 0, 0, 0);
	        $scope.tiles.push({title:"Vacances d'été "+a.getFullYear(), from:a, to:b, nbCours:0, nbProfs:0, nbConflits:0, disabled:false});
	        break;

	        case 2: // Affichage des mois de la période
	        if ($scope.currentTile.title.includes("automne"))
	        	$rootScope.tagTemps = "Automne";
	        else if ($scope.currentTile.title.includes("printemps"))
	        	$rootScope.tagTemps = "Printemps";
	        else
	        	$rootScope.tagTemps = "Été 2016";

	        var sameYear = (end.getFullYear()-start.getFullYear() == 0) ? true : false;
	        var nbMois = end.getMonth()-start.getMonth();

	        if (!sameYear)
	        	nbMois += 12;


	        for (var i = 0; i<nbMois; i++) {

	        	var a = new Date(start.getTime());
	        	var b = new Date(start.getTime());
	        	a.setMonth(a.getMonth()+i);
	        	b.setMonth(a.getMonth()+1);
	        	var titre = a.toLocaleString("fr-fr", { month: "long" }).capitalizeFirstLetter();

	        	$scope.tiles.push({title:titre, from:a, to:b, nbCours:0, nbProfs:0, nbConflits:0, disabled:false});
	        }
	        break;

	        case 3: // Affichage des jours du mois
	        $rootScope.tagTemps = start.toLocaleString("fr-fr", { month: "long" }).capitalizeFirstLetter();

	        var month = start.getMonth()+1;
	        var year = start.getYear();
	        var nbDaysInMonth = getDaysInMonth(month, year);

	        var nbDaysBeforeMonth = start.getDay()-1;
	        	if (nbDaysBeforeMonth == -1) { // Conversion du jour dans le système de date européen (lundi:0, dimanche:6)
	        		nbDaysBeforeMonth = 6;
	        	}

	        	// Conversion du jour dans le système de date européen (lundi:0, dimanche:6)
	        	var nbDaysAfterMonth = end.getDay()-1;
	        	if (nbDaysAfterMonth == -1) {
	        		nbDaysAfterMonth = 6;
	        	}
	        	// On veut le dernier jour du mois et pas le premier jour du mois suivant, d'où le -1
	        	nbDaysAfterMonth = nbDaysAfterMonth-1;
	        	if (nbDaysAfterMonth == -1) {
	        		nbDaysAfterMonth = 6;
	        	}
	        	nbDaysAfterMonth = 6-nbDaysAfterMonth;

	        	// Tuiles des jours du mois
	        	for (var i = -nbDaysBeforeMonth; i<nbDaysInMonth+nbDaysAfterMonth; i++) {

	        		var a = new Date(start.getTime());
	        		a.setDate(a.getDate()+i);
	        		var b = new Date(a.getTime());
	        		b.setDate(a.getDate()+1);
	        		var titre = a.getDate().toString();

	        		var isTileDisabled = ((i>=0 && i<nbDaysInMonth) ? false : true);

	        		$scope.tiles.push({title:titre, from:a, to:b, nbCours:0, nbProfs:0, nbConflits:0, disabled:isTileDisabled});
	        	}
	        	break;

	        case 4: // Affichage d'un jour du mois
	        $rootScope.tagTemps = $scope.currentTile.title+" "+start.toLocaleString("fr-fr", { month: "short" });

	        filtreTempo.time_range = start.getTime()/1000;
	        filtreService.getCours(false).then(function(response) { $scope.coursDuJour = response.data; });
	        return;
	        break;
	    }


	    $scope.tiles.forEach(function(tile) {
	    	filtreTempo.time_range = tile.from.getTime()/1000+","+((tile.to.getTime()/1000)-1);
	    	tempFiltreConflit = filtreConflit.conflit;
	    	filtreConflit.conflit = '';
	    	filtreService.getCours(true).then(function(response) { tile.nbCours = response.data; });
	    	// Si jamais le filtre conflit est nul, alors on affiche tous les conflits par défaut (no_staff)
	    	if(tempFiltreConflit == ''){
	    		filtreConflit.conflit = 'no_staff';
	    		filtreService.getCours(true).then(function(response) {
	    			tile.nbConflits = response.data;

	    			if ($scope.nbConflitsMax < parseInt(response.data)) {
	    				$scope.nbConflitsMax = parseInt(response.data); 
	    			}
	    		});
	    	}
	    	// Si jamais on considère uniquement les cours sans conflit, alors on n'affiche aucun conflit
	    	else if(tempFiltreConflit =='no_conflict'){
	    		tile.nbConflits = 0;
	    	}
	    	// Sinon, on fait une requête classique en prenant le filtre conflit actuel
	    	else{
	    		filtreConflit.conflit = tempFiltreConflit;
	    		filtreService.getCours(true).then(function(response) {
	    			tile.nbConflits = response.data;

	    			if ($scope.nbConflitsMax < parseInt(response.data)) {
	    				$scope.nbConflitsMax = parseInt(response.data); 
	    			}
	    		});
	    	}
	    	
	    	filtreConflit.conflit = tempFiltreConflit;
	    });

	 	// Donne aux filtres leurs vraies valeurs
	 	filtreTempo.time_range = start.getTime()/1000+","+end.getTime()/1000;
	 };
	});


var getDaysInMonth = function(month,year) {   
	return new Date(year, month, 0).getDate();
}


app.filter('currentMonth', function() {
	return function(x) {
		var a = new Date(x.getTime());
		return a.toLocaleString("fr-fr", { month: "long" });
	};
});

app.filter('previousMonth', function() {
	return function(x) {
		var a = new Date(x.getTime());
		a.setMonth(a.getMonth()-1);
		return a.toLocaleString("fr-fr", { month: "long" });
	};
});



String.prototype.capitalizeFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}