// PROJET VISUALISATION 2
// VERSION 1.0 - 08/06/2015

// Controller de la page statistiques
angular.module('mainApp').controller('statsCtrl', function ($scope, $log, $http, $rootScope, FiltreService) {

	// Graphe de répartition des cours pour la période
	var typesConflits=['no_conflict', 'no_host', 'no_teacher', 'no_host,no_teacher'];
	var nomsConflits=['Sans conflit', 'Sans hôte', 'Sans professeur', 'Sans prof/hôte'];
	var arrayPeriodes = ["Semestre d'automne", "Semestre de printemps", "Eté"];
	var viewRepartitionCours = $("#repartitionCours");
	var viewRepartitionConflits = $("#repartitionConflits");
	var viewRepartitionIntensites = $("#repartitionIntensites");
	var viewEvolutionConflits = $("#evolutionConflits");

	var dataRepartitionCours = {
		labels: [],
		datasets: [
		{
			label: "Nombre de cours",
			backgroundColor: "rgba(250,188,34,0.6)",
			hoverBackgroundColor: "rgba(250,188,34,0.8)",
			hoverBorderColor: "rgba(23,85,160,1)",
			data: [],
		}
		]
	};
	var dataRepartitionConflits = {
		labels: ["Aucun conflit", "Hôte manquant", "Professeur manquant", "Hôte et professeur manquant"],
		datasets: [
		{
			data: [0,0,0,0],
			backgroundColor: [
			"rgba(250,188,34,0.6)",
			"rgba(103,137,16,0.6)",
			"rgba(23,85,160,0.6)",
			"rgba(201,56,56,0.6)"
			],
			hoverBackgroundColor: [
			"rgba(250,188,34,0.8)",
			"rgba(103,137,16,0.8)",
			"rgba(23,85,160,0.8)",
			"rgba(201,56,56,0.8)"
			],
		}]
	};
	var dataRepartitionIntensites = {
		labels: ["Standard", "Running", "75'", "Cardio Pump", "Famille", "Basic", "Core", "Intensif", "Cardio Flex", "Flex", "Clubbing", "Modéré", "Dance", "Circuit"],
		datasets: [
		{
			data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			data_id:[],
			backgroundColor: [
			"rgba(255,157,0,0.6)",
			"rgba(45,204,112,0.6)",
			"rgba(255,219,63,0.6)",
			"rgba(254,19,52,0.6)",
			"rgba(143,97,134,0.6)",
			"rgba(0,207,247,0.6)",
			"rgba(133,75,198,0.6)",
			"rgba(255,86,111,0.6)",
			"rgba(255,0,109,0.6)",
			"rgba(56,169,239,0.6)",
			"rgba(0,31,78,0.6)",
			"rgba(0,97,150,0.6)",
			"rgba(247,140,49,0.6)",
			"rgba(229,11,40,0.6)"
			],
			hoverBackgroundColor: [
			"rgba(255,157,0,0.8)",
			"rgba(45,204,112,0.8)",
			"rgba(255,219,63,0.8)",
			"rgba(254,19,52,0.8)",
			"rgba(143,97,134,0.8)",
			"rgba(0,207,247,0.8)",
			"rgba(133,75,198,0.8)",
			"rgba(255,86,111,0.8)",
			"rgba(255,0,109,0.8)",
			"rgba(56,169,239,0.8)",
			"rgba(0,31,78,0.8)",
			"rgba(0,97,150,0.8)",
			"rgba(247,140,49,0.8)",
			"rgba(229,11,40,0.8)"
			],

		}]
	};
	var dataEvolutionConflits = {
		labels:  [],
		datasets: [
		{
			label: "Nombre de conflits",
			data: [],
			backgroundColor: "rgba(42,63,84,0.6)",
			hoverBackgroundColor: "rgba(42,63,84,0.8)",
		}
		]
	};
	var pieOptions = {
		onClick: function(e) {
			filtrerParConflit(e);
		}

	};
	var intensitesOptions = {
		onClick: function(e) {
			filtrerParIntensite(e);
		}
	};
	var grapheRepartitionCours = new Chart(viewRepartitionCours, {
		type: 'bar',
		data: dataRepartitionCours,
	});
	var grapheRepartitionConflits = new Chart(viewRepartitionConflits, {

		type: 'pie',
		data: dataRepartitionConflits,
		options:pieOptions
	});
	var grapheRepartitionIntensites = new Chart(viewRepartitionIntensites, {

		type: 'doughnut',
		data: dataRepartitionIntensites,
		options:intensitesOptions
	});
	
	var grapheEvolutionConflits = new Chart(viewEvolutionConflits, {
		type: 'line',
		data: dataEvolutionConflits,
	});

	evaluerTimeRange();



	// Evalue le filtre temporel actuel pour afficher le graphe correspondant
	function evaluerTimeRange(){
		var temp_time_range = filtreTempo.time_range;
		var time_range_type;
		if(filtreTempo.time_range.toString().indexOf(',') > -1){
			var arrayRange = (filtreTempo.time_range).split(',');
			var debut = moment(parseInt(arrayRange[0])*1000);
			var fin = moment(parseInt(arrayRange[1])*1000);
			time_range_type = Math.abs(debut.diff(fin, 'months'));
		}
		else{
			time_range_type = 0; // Time_range correspondant à un jour
			var debut = moment(filtreTempo.time_range*1000);
			var fin = debut.clone().add(1, "day");
		}


		// Filtre temporel année : affichage des saisons
		if(getMois(debut,fin).length == 12)
		{
			afficherDiagrammeAnnees(debut);
		}
		else
		{
			// Filtre temporel saison : affichage des mois de la saison
			if(time_range_type > 1){
				var arrayMois = getMois(debut, fin);
				for(var index  = 0 ; index < arrayMois.length ; index++){
					afficherDataMois(index, arrayMois);
				}
			}
			// Filtre temporel mois : affichage des jours du mois
			else if(time_range_type == 1){
				var arrayJours = getJours(debut, fin);
				for(var index  = 0 ; index < arrayJours.length ; index++){
					afficherDataJours(index, arrayJours);
				}
			}
			// Filtre temporel jour : affichage des heures du jour
			else if(time_range_type < 1){
				var arrayHeures = getHeures(debut, fin);
				for(var index  = 0 ; index < arrayHeures.length ; index++){
					afficherDataHeures(index, arrayHeures);
				}
			}
		}
		var tempFiltreConflit = filtreConflit.conflit;
		// Affichage des conflits pour la période
		for(var i = 0; i < typesConflits.length ; i++ ){

			afficherDataConflits(typesConflits[i], temp_time_range, i);
			filtreConflit.conflit = tempFiltreConflit;
		}

		$http.get("./data/intensites.json").then(function(response) {
			temp_intensite = filtreIntensite.intensite;
			var intensites =  response.data;
			for(index in intensites){
				afficherDataIntensites(intensites[index].id, index, intensites[index].intensite)
				filtreIntensite.intensite = temp_intensite;
			}
		});
		

	}

	// Affiche les données pour chaque période : il y a redondance du code car les périodes ne sont pas des données usuelles connues du format Date
	function afficherDiagrammeAnnees(debut){
		afficherDataPeriode(debut,debut.clone().add(4, 'months'), 0);
		afficherDataPeriode(debut.clone().add(4, 'months'),debut.clone().add(10, 'months'), 1);
		afficherDataPeriode(debut.clone().add(10, 'months'),debut.clone().add(12, 'months'), 2);
	}

		// Renvoie le nombre de cours dans la période donnée (debut, fin = objets Date) 
		// La variable index est nécessaire pour savoir à quel endroit de data placer la donnée
		function afficherDataPeriode(debut, fin, index){
			filtreTempo.time_range = debut.unix() + ',' + fin.unix();
			filtreService.getCours(true).then(function(response){
				dataRepartitionCours.datasets[0].data[index] = parseInt(response.data);
				grapheRepartitionCours.update();
			});
			dataRepartitionCours.labels = ["Semestre d'automne", "Semestre de printemps", "Eté"];
			var tempFiltreConflit = filtreConflit.conflit;
			filtreConflit.conflit = 'no_staff';
			filtreService.getCours(true).then(function(response){
				dataEvolutionConflits.datasets[0].data[index] = parseInt(response.data);
				grapheEvolutionConflits.update();
			});
			filtreConflit.conflit = tempFiltreConflit;
			dataEvolutionConflits.labels = ["Semestre d'automne", "Semestre de printemps", "Eté"];
		}

		// Retourne la liste de mois entre début et fin, au format moment()
		function getMois(debut, fin){
			var curseur = moment(debut);
			var momentFin = moment(fin);
			var arrayMois = [];
			while(curseur.month() != momentFin.month() || curseur.year() != momentFin.year()){
				arrayMois.push(curseur.clone());
				curseur.add(1, 'month');
			}
			return arrayMois;
		}

		// Retourne la liste de jours entre début et fin, au format moment()
		function getJours(debut, fin){
			var curseur = moment(debut);
			var momentFin = moment(fin);
			var arrayJours = [];
			while(curseur.day() != momentFin.day() || curseur.month() != momentFin.month()){
				arrayJours.push(curseur.clone());
				curseur.add(1, 'day');
			}
			return arrayJours;
		}

		// Retourne la liste de jours entre début et fin, au format moment()
		function getHeures(debut, fin){
			var curseur = moment(debut);
			var momentFin = moment(fin);
			var arrayHeures = [];
			while(curseur.hour() != momentFin.hour() || curseur.day() != momentFin.day()){
				arrayHeures.push(curseur.clone());
				curseur.add(1, 'hour');
			}
			return arrayHeures;
		}

		// Affiche les données pour chaque mois
		function afficherDataMois(index, arrayMois){
			var debutMois = arrayMois[index];
			var finMois = arrayMois[index].clone().add(1, 'month');
			filtreTempo.time_range = debutMois.unix()+','+finMois.unix();
			filtreService.getCours(true).then(function(response){
				dataRepartitionCours.datasets[0].data[index] = parseInt(response.data);
				dataRepartitionCours.datasets[0].label = "Répartition des cours sur la période " + $rootScope.tagTemps;;
				// Format français pour le nom des mois
				dataRepartitionCours.labels[index] = debutMois.lang('fr').format('MMMM');
				grapheRepartitionCours.update();
			});
			var tempFiltreConflit = filtreConflit.conflit;
			filtreConflit.conflit = 'no_staff';
			filtreService.getCours(true).then(function(response){
				dataEvolutionConflits.datasets[0].data[index] = parseInt(response.data);
				dataEvolutionConflits.datasets[0].label = "Evolution des conflits sur la période " + $rootScope.tagTemps;;
				// Format français pour le nom des mois
				dataEvolutionConflits.labels[index] = debutMois.lang('fr').format('MMMM');
				grapheEvolutionConflits.update();
			});
			filtreConflit.conflit = tempFiltreConflit;
		}

		// Affiche les données pour chaque mois
		function afficherDataJours(index, arrayJours){
			var debutJours = arrayJours[index];
			var finJours = arrayJours[index].clone().add(1, 'day');
			filtreTempo.time_range = debutJours.unix()+','+finJours.unix();
			filtreService.getCours(true).then(function(response){
				dataRepartitionCours.datasets[0].data[index] = parseInt(response.data);
				dataRepartitionCours.datasets[0].label = "Répartition des cours sur le mois de " + debutJours.lang('fr').format('MMMM');
				// Format français pour le nom des jours
				dataRepartitionCours.labels[index] = debutJours.lang('fr').format('DD');
				grapheRepartitionCours.update();
			});
			var tempFiltreConflit = filtreConflit.conflit;
			filtreConflit.conflit = 'no_staff';
			filtreService.getCours(true).then(function(response){
				dataEvolutionConflits.datasets[0].data[index] = parseInt(response.data);
				dataEvolutionConflits.datasets[0].label = "Evolution des conflits sur le mois de " + debutJours.lang('fr').format('MMMM');
				// Format français pour le nom des jours
				dataEvolutionConflits.labels[index] = debutJours.lang('fr').format('DD');
				grapheEvolutionConflits.update();
			});
			filtreConflit.conflit = tempFiltreConflit;
		}

		// Affiche les données pour chaque jour
		function afficherDataHeures(index, arrayHeures){
			var debutHeures = arrayHeures[index];
			var finHeures = arrayHeures[index].clone().add(1, 'hour');
			filtreTempo.time_range = debutHeures.unix()+','+finHeures.unix();
			filtreService.getCours(false).then(function(response){
				dataRepartitionCours.datasets[0].data[index] = compterNbCours(response.data, debutHeures, finHeures);
				dataRepartitionCours.datasets[0].label = "Répartition des cours sur le " + $rootScope.tagTemps;
				// Format français pour le nom des jours
				dataRepartitionCours.labels[index] = debutHeures.lang('fr').format('HH');
				grapheRepartitionCours.update();
			});
			var tempFiltreConflit = filtreConflit.conflit;
			filtreConflit.conflit = 'no_staff';
			filtreService.getCours(false).then(function(response){
				dataEvolutionConflits.datasets[0].data[index] = compterNbCours(response.data, debutHeures, finHeures);
				dataEvolutionConflits.datasets[0].label = "Evolution des conflits sur le " + $rootScope.tagTemps;
				// Format français pour le nom des jours
				dataEvolutionConflits.labels[index] = debutHeures.lang('fr').format('HH');
				grapheEvolutionConflits.update();
			});
			filtreConflit.conflit = tempFiltreConflit;
		}


		// Compte le nombre de cours selon la période horaire sélectionnée
		function compterNbCours(arrayCours, debutHeures, finHeures){
			var compteur = 0;
			var momentCours;
			for(index in arrayCours){
				momentCours = moment(arrayCours[index].class_date+ ' ' +arrayCours[index].class_starttime);
				if(debutHeures <= momentCours && momentCours <= finHeures){
					compteur++;
				}
			}
			return compteur;
		}

		function afficherDataConflits(typeConflit, temp_time_range, index){
			filtreTempo.time_range = temp_time_range;
			filtreConflit.conflit=typeConflit;
			filtreService.getCours(true).then(function(response){
				switch(typeConflit)
				{
					case 'no_conflict':
					dataRepartitionConflits.labels[index] = 'Aucun conflit';
					break;
					case 'no_host':
					dataRepartitionConflits.labels[index] = 'Hôte manquant';
					break;
					case 'no_teacher':
					dataRepartitionConflits.labels[index]= 'Professeur manquant';
					break;
					case 'no_host,no_teacher':
					dataRepartitionConflits.labels[index] = 'Hôte et professeur manquant';
					break;
				}
				dataRepartitionConflits.datasets[0].data[index] = parseInt(response.data);
				dataRepartitionConflits.datasets[0].label = "Répartition des cours sur la période : " + $rootScope.tagTemps;
				grapheRepartitionConflits.update();
			});
		}

		function afficherDataIntensites(intensite_id, index, intensite){
			// On conserve la variable intensité du filtre pour la remettre ensuite
			filtreIntensite.intensite = intensite_id;
			filtreService.getCours(true).then(function(response){
				dataRepartitionIntensites.datasets[0].data[index] = response.data;
				dataRepartitionIntensites.labels[index] = intensite;
				grapheRepartitionIntensites.update();
			});
		}
		function filtrerParIntensite(event){
			// On supprime le filtre conflit car c'est soit l'un soit l'autre
			filtreConflit.conflit = '';
			data = grapheRepartitionIntensites.getElementsAtEvent(event)[0];
			if(typeof data != 'undefined' && data != null){
				$http.get("./data/intensites.json").then(function(response) {
					var intensites =  response.data;
					$rootScope.tagStats = intensites[data._index].intensite;
					filtreIntensite.intensite = intensites[data._index].id;
					evaluerTimeRange();
				});
			}
		}
		function filtrerParConflit(event){
			// On supprime le filtre intensité car c'est soit l'un soit l'autre
			filtreIntensite.intensite = '';
			data = grapheRepartitionConflits.getElementsAtEvent(event)[0];
			if(typeof data != 'undefined' && data != null){
				$rootScope.tagStats = nomsConflits[data._index];
				// Il faut updater le scope
				$rootScope.$apply();
				filtreConflit.conflit = typesConflits[data._index];
				evaluerTimeRange();
			}

		}

		// Listener lorsqu'on clique sur "Close" (retrait des filtres statistiques)
		$rootScope.$on('retraitStats', function(event) {
			evaluerTimeRange();
		});

	});
