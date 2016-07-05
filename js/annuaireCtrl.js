// PROJET VISUALISATION 2
// VERSION 1.0 - 08/06/2015

// Controleur de la page annuaire
angular.module('mainApp').controller('annuaireCtrl', function ($scope, $rootScope, $log, $http, FiltreService) {

	$scope.listeProfs = null;

	// On sauvegarde les filtres pour afficher tous les professeurs temporairement
	$scope.varTemp1 = filtreTempo.time_range;
	$scope.varTemp2 = filtreGeo.pays;
	$scope.varTemp3 = filtreGeo.gps_range;
	$scope.varTemp4 = filtreGeo.region;
	$scope.varTemp5 = filtreGeo.salle;

	//  On réinitiailise les filtres pour effectuer une requête non filtrée
	filtreTempo.time_range='';
	filtreGeo.pays='';
	filtreGeo.gps_range='';
	filtreGeo.region='';
	filtreGeo.salle='';
	
	filtreService.getStaff(false).then(function(response) { $scope.listeProfs = response.data; });

	// On réaffecte les filtres après la requête
	filtreTempo.time_range = $scope.varTemp1;
	filtreGeo.pays=$scope.varTemp2;
	filtreGeo.gps_range=$scope.varTemp3;
	filtreGeo.region=$scope.varTemp4;
	filtreGeo.salle=$scope.varTemp5;


	$scope.changerPersonneRecherchee=function(value) {
		$rootScope.personneRecherchee = value;
	}


	$scope.indexOfStaffSelected=function(staff) {
		for (var i=0; i<$rootScope.personnesSelectionnees.length; i++) {
			$scope.c = $rootScope.personnesSelectionnees[i];

			if ($scope.c.staff_id == staff.staff_id) {// && $scope.getCountryCodeFromCity($scope.c.classroom_city) == $scope.getCountryCodeFromCity(classroom.classroom_city)) {
				return i;
			}
		}

		return -1;
	}

	$scope.addOrRemoveStaff=function(staff){
		var index = $scope.indexOfStaffSelected(staff); //$scope.personnesSelectionnees.indexOf(classroom)

		if (index > -1)
		    $rootScope.personnesSelectionnees.splice(index, 1);
		else
			$rootScope.personnesSelectionnees.push(staff);


		// Annulation de la selection multiple
		var autoriserSelectionMultiple = false;
		if (!autoriserSelectionMultiple)
			$rootScope.personnesSelectionnees.splice(0, $rootScope.personnesSelectionnees.length - 1);


		// Mise à jour du filtre staff
		if ($rootScope.personnesSelectionnees.length > 0) {

			$scope.staffTemp = $rootScope.personnesSelectionnees[$rootScope.personnesSelectionnees.length-1];
			console.log(filtreStaff);
			filtreStaff.staff = $scope.staffTemp.staff_id;
			$rootScope.tagStaff = $scope.staffTemp.staff_name;
		} 
		else {
			$scope.resetStaff();
		}
	}

	$scope.changerPersonneCourante=function(staff){
		$scope.personneCourante = staff;
	};
});