// PROJET VISUALISATION 2
// VERSION 1.0 - 08/06/2015

// Controller de la page carte
angular.module('mainApp').controller('carteCtrl', function ($scope, $rootScope, $log, $http, $compile, FiltreService) {
// CONSTANTES
// Pour rajouter des pays, il suffit de rajouter le code pays et de renseigner le geoJSON correspondant aux frontières du pays dans data/layersPays.json
var arrayPays = ['FR', 'CA', 'UK', 'CH', 'ES'];
// Niveaux de zoom
var ZOOM_REGIONS = 6;
var ZOOM_SALLES = 12;
$scope.mapView =true;
$scope.sallesSelectionnees = [];
$scope.salleRecherche = "";

// ELEMENTS LEAFLET
// Carte
var carte = L.map('mapid',{
	worldCopyJump:true,
	zoomAnimation:true,
});
// Layers de pays
var featureGroupPays = L.featureGroup();
// Marqueurs de région
var featureGroupRegions = L.featureGroup();
// Marqueurs de salles
var featureGroupSalles = L.featureGroup();
// Pop-up d'absence de salle
var popUpNoSalles = L.popup({maxWidth:160,maxHeight:50,closeButton:false,closeOnClick:true,offset:[0,-15],autopan:true})
.setContent('<p><b>Erreur</b><br />Pas de salle disponible dans cette région.</p>');
// Icône de marqueur région
var iconeRegion = L.AwesomeMarkers.icon({
	icon: 'glyphicon-zoom-in',
	markerColor: 'orange',
	iconColor:'#1755A0'
});
 // Icône de marqueur salle
 var iconeSalle = L.AwesomeMarkers.icon({
 	icon: 'glyphicon-pushpin',
 	markerColor: 'orange',
 	iconColor:'#1755A0'
 });
  // Style de layer pays
  var styleLayersPays = {
  	weight: 2,
  	opacity: 1,
  	color: '#1755A0',
  	dashArray: '3',
  	fillOpacity: 0.4,
  	fillColor: '#FABC22'
  };
 // Pop-up de salle
 var popUpSalle = L.popup({maxWidth:300,maxHeight:400,closeButton:false,closeOnClick:true,offset:[0,-15]});


// Initialisation de la map
initAll();


// Renvoie les coordonnées des boundaries du filtre géographique actuel
function getCoordonnees(){
	var array = filtreGeo.gps_range.split(",");
}

// Restaure la carte au filtre géographique sélectionné
// NB : On ne peut pas sauvegarder le mapstate avec les bounds car le filtre géographique peut être changé en dehors de la carte (via la suppression de filtres du menu)
function setCarte(){
	if(filtreGeo.salle !=''){
		// Si jamais il y a déjà des marqueurs (cas d'un retour sur la page carte)
		if(featureGroupSalles > 0){
		// On doit récupérer toutes les salles mais on veut aussi conserver le filtre de salle. Du coup on stocke ce dernier
		var filtreSalle = filtreGeo.salle;
		// Puis on retire le filtre salle
		filtreGeo.salle = '';
		ajouterMarqueursSalles();
		// Et on le récupère
		// Sinon plus simple, on sauvegarde le niveau de zoom et le centre de la map juste avant de switcher de vue et on le réaffecte à chque fois dans initMap
		filtreGeo.salle = filtreSalle;
	}
	// sinon (cas d'un clic externe à partir du calendrier)
	else{
		$http.get(apiURL+'/classroom/classroom_id='+filtreGeo.salle).then(function(response){
			var salle = response.data[0];
			// On récupère l'id de la région
			filtreGeo.region = salle.region_id;
			$rootScope.tagGeo = salle.classroom_name;

			// Certaines salles ayant le même ID, on a besoin de connaître le pays considéré
			if(salle.classroom_city == 'London'){
				paysActuel = 'Angleterre';
				filtreGeo.pays='UK';
			}
			else if(salle.classroom_city == 'Genève' || salle.classroom_city == 'Zürich'){
				paysActuel = 'Suisse';
				filtreGeo.pays='CH';
			}
			else if(salle.classroom_city == 'Montreal' || salle.classroom_city == 'Montréal'){
				paysActuel = 'Canada';
				filtreGeo.pays='CA';
			}
			else if(salle.classroom_city == 'Barcelona'){
				paysActuel = 'Espagne';
				filtreGeo.pays='ES';
			}
			else{
				paysActuel = 'France';
				filtreGeo.pays='FR';
			}

			// et à partir de cet ID, on obtient l'objet région pour afficher les salles de la région
			$http.get(apiURL+'/classroom/region_id='+filtreGeo.region).then(function(response){
				salles = response.data
				for(index in salles){
					var salle = salles[index];
					var marqueur = L.marker([salle.classroom_gps_lat, salle.classroom_gps_lon], {icon:iconeSalle,title:salle.classroom_name, riseOnHover:true});
					marqueur.on('click', onSalleClick);
					// On affecte une nouvelle propriété au marqueur : classroom_id (pour connaître la salle cliquée)
					marqueur.classroom_id = salle.classroom_id;
					marqueur.classroom_name = salle.classroom_name;
					featureGroupSalles.addLayer(marqueur);
					afficherMarqueursSalles();
					afficherPopUpSalle();
				}
			});
		});
	}

}
else if(filtreGeo.region != ''){
	ajouterMarqueursSalles();
}
else if(filtreGeo.pays != ''){
	ajouterMarqueursRegions();
}
else if(filtreGeo.gps_range != ''){
	var array = filtreGeo.gps_range.split(",");
	var coin_haut_gauche = L.point(array[0],array[1]);
	var coin_bas_droite = L.point(array[2],array[3]);
	var boundaries = L.bounds(coin_haut_gauche, coin_bas_droite);
	var centre = boundaries.getCenter();	
	carte.setView([centre.x,centre.y], zoom_default);
}
else{
	var centre_europe = L.point(center_europe_default[0],center_europe_default[1]);
	carte.setView([centre_europe.x,centre_europe.y], zoom_default);
	ajouterLayersPays();
}
}

// Au clic sur un layer (pays) :
// Recentrage sur le pays
// Zoom
// Affichage des régions selon le code pays
function onPaysClick(e){
	switch(e.target.country_code){
		case 'FR' :
		paysActuel = 'France';
		filtreGeo.pays = 'FR';
		break;
		case 'CA' :
		paysActuel = 'Canada';
		filtreGeo.pays = 'CA';
		break;
		case 'ES' :
		paysActuel = 'Espagne';
		filtreGeo.pays = 'ES';
		break;
		case 'CH' :
		paysActuel = 'Suisse';
		filtreGeo.pays = 'CH';
		break;
		case 'UK' :
		paysActuel = 'Royaume-Uni';
		filtreGeo.pays = 'UK';
		break;
	}

	$rootScope.sallesSelectionnees = [];
	$rootScope.tagGeo = paysActuel;
	ajouterMarqueursRegions();
}

// Initialisation de l'ensemble de la carte
function initAll(){
	retirerLayersPays();
	retirerMarqueursRegions();
	retirerMarqueursSalles();
	retirerPopUps();
	initMap();
}

function initMap(){
	setCarte();
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Gym Suédoise',
		maxZoom: 18,
		minZoom:3,
		id: 'ojathelonius.04g52fo8',
		accessToken: 'pk.eyJ1Ijoib2phdGhlbG9uaXVzIiwiYSI6ImNpbzV0bXVmNDAwNHV2eWtwa2ZycnhrMXIifQ.6YqVmLEfFdRV4k9a_KY5gg'
	}).addTo(carte);

	// Listener du zoom
	carte.on('zoomend', verifierZoomEnd);
	carte.on('zoomstart', verifierZoomStart);

	// Listener d'ouverture de pop-up
	carte.on('popupopen', centrerPopUp);
}

function ajouterLayersPays(){
	$http.get("./data/layersPays.json").then(function(response) {
		if(!checkLayersPays()){
			var layersPays =  response.data;
			var tempLayer;
			for(index in arrayPays){
				var pays = arrayPays[index];
				tempLayer =  L.geoJson(layersPays[pays], {
					style: styleLayersPays});
				tempLayer.on('click', onPaysClick);
				tempLayer.country_code = pays;
				featureGroupPays.addLayer(tempLayer);
			}
			afficherLayersPays();
		}
	});
}

function afficherLayersPays(){
	featureGroupPays.eachLayer(function (layer) {
		layer.addTo(carte);
	});
}


function retirerLayersPays(){
	featureGroupPays.eachLayer(function (layer) {
		carte.removeLayer(layer);
	});
	featureGroupPays.clearLayers();
}

// Vérifie si la carte comporte encore des layers pays
function checkLayersPays(){
	if(typeof featureGroupPays.getLayers() !== 'undefined' && featureGroupPays.getLayers().length > 0){
		return true;
	}
	else{
		return false;
	}
}

// Vérifie si la carte comporte encore des marqueurs région
function checkMarqueurRegions(){
	if(typeof featureGroupRegions.getLayers() !== 'undefined' && featureGroupRegions.getLayers().length > 0){
		return true;
	}
	else{
		return false;
	}
}

// Analyser le zoom une fois terminé
function verifierZoomEnd(){
	if(carte.getZoom() < 10 && carte.getZoom() > 6 && !checkLayersPays() && !checkMarqueurRegions())
	{
		$rootScope.tagGeo = paysActuel;
		// On retire le filtre géographique de région et de salle
		filtreGeo.region = '';
		filtreGeo.salle = '';
		// On rattache les marqueurs de région à la carte si ils n'y sont pas déjà
		if(estVide(featureGroupRegions)){
			ajouterMarqueursRegions();
		}
		// On retire les marqueurs de salles, trop clusterisés pour être visibles
		retirerMarqueursSalles();
	}
	if(carte.getZoom() < 6)
	{
		// On retire tous les filtres car on dézoome "à fond"
		$rootScope.sallesSelectionnees = [];
		filtreGeo.retirerTout();
		// On rattache les layers à la carte si ils n'y sont pas déjà
		if(estVide(featureGroupPays)){
			ajouterLayersPays();
		}
		// On vide la variable paysActuel
		paysActuel = '';
		$rootScope.tagGeo = $rootScope.tagGeoDefaut;
		// On retire les marqueurs de régions, trop clusterisés pour être visibles
		retirerMarqueursRegions();
	}
}

// Analyser le zoom au début
function verifierZoomStart(){
	retirerPopUps();
}

function ajouterMarqueursRegions(e){
	filtreService.getRegions(false).then(function(response) {
		regions = response.data;
		for(index in regions){
			var region = regions[index];
			var marqueur = L.marker([region.region_gps_lat, region.region_gps_lon], {icon:iconeRegion,title:region.region_name, riseOnHover:true});
			marqueur.on('click', onRegionClick);
			// On affecte une nouvelle propriété au marqueur : region_id (pour connaître la région cliquée)
			marqueur.region_id = region.region_id;
			marqueur.region_name = region.region_name;
			featureGroupRegions.addLayer(marqueur);
		}
		if(!estVide(featureGroupRegions)){
			afficherMarqueursRegions();
			retirerLayersPays();
		}
		else{
		}
	});
}

// Appel à l'API
function getRegions(country){
	var regions = HTTP_UTF8("/region/region_country_code="+country);
	return regions;
}

function afficherMarqueursRegions(){
	featureGroupRegions.eachLayer(function (layer) {
		layer.addTo(carte);
	});
	centrerSurRegions();
}

function onRegionClick(e){
	$rootScope.sallesSelectionnees = [];
	filtreGeo.region = e.target.region_id;
	ajouterMarqueursSalles(e);
}

function retirerMarqueursRegions(){
	featureGroupRegions.eachLayer(function (layer) {
		carte.removeLayer(layer);
	});
	featureGroupRegions.clearLayers();
}

function centrerSurRegions(){
	var centreBounds = featureGroupRegions.getBounds().getCenter();
	carte.setView(centreBounds, ZOOM_REGIONS, {zoom:{animate:true}});
}

function centrerSurSalles(){
	var centreBounds = featureGroupSalles.getBounds().getCenter();
	carte.setView(centreBounds, ZOOM_SALLES, {animate:true, duration:6.0, easeLinearity:1});
}

function HTTP_UTF8(params){
	return $http.get(apiURL+params, {header : {'Content-Type' : 'application/json; charset=UTF-8'}});
}

function ajouterMarqueursSalles(e){
	filtreService.getSalles(false).then(function(response) {
		salles = response.data;
		for(index in salles){
			var salle = salles[index];
			var marqueur = L.marker([salle.classroom_gps_lat, salle.classroom_gps_lon], {icon:iconeSalle,title:salle.classroom_name, riseOnHover:true});
			marqueur.on('click', onSalleClick);
			// On affecte une nouvelle propriété au marqueur : classroom_id (pour connaître la salle cliquée)
			marqueur.classroom_id = salle.classroom_id;
			marqueur.classroom_name = salle.classroom_name;
			featureGroupSalles.addLayer(marqueur);
		}
		if(!estVide(featureGroupSalles)){
			// Si c'est bien suite à un clic
			if(typeof e != 'undefined' || e != null){
				$rootScope.tagGeo = e.target.region_name;
			}
			afficherMarqueursSalles();
			retirerMarqueursRegions();
		}
		else{
			popUpNoSalles.setLatLng(e.latlng).addTo(carte);
		}
	});
}

function afficherMarqueursSalles(){
	featureGroupSalles.eachLayer(function (layer) {
		layer.addTo(carte);
	});
	centrerSurSalles();
}

function retirerMarqueursSalles(){
	featureGroupSalles.eachLayer(function (layer) {
		carte.removeLayer(layer);
	});
	featureGroupSalles.clearLayers();
}

function onSalleClick(e){
	// Sélection de la tuile correpondante dans l'onglet de recherche
	$rootScope.sallesSelectionnees = [];
	$rootScope.sallesSelectionnees.push(e.target);

	$rootScope.tagGeo = e.target.classroom_name;
	filtreGeo.salle = e.target.classroom_id;
	afficherPopUpSalle();
}

function estVide(group){
	if(typeof group.getLayers() !== 'undefined' && group.getLayers().length > 0){
		return false;
	}
	else{
		return true;
	}
}

function retirerPopUps(){
	carte.removeLayer(popUpNoSalles);
	carte.removeLayer(popUpSalle);
}

function afficherPopUpSalle(){
	filtreService.getSalles(false).then(function(response) {
		var infoSalle = response.data[0];
		tempHTML = getContenuPopUp(response.data[0]);
		popUpSalle.setLatLng([infoSalle.classroom_gps_lat, infoSalle.classroom_gps_lon]);
		popUpSalle.addTo(carte);
		popUpSalle.setContent(tempHTML);
		console.log('pop up :  ' + popUpSalle);
	});
}

$scope.changeMapView = function(value){
	$scope.mapView = value;
	if(filtreGeo.salle != ''){
		retirerLayersPays();
		retirerMarqueursRegions();
		retirerMarqueursSalles();
		$http.get(apiURL+'/classroom/classroom_id='+filtreGeo.salle).then(function(response){
			var salle = response.data[0];
			// On récupère l'id de la région
			filtreGeo.region = salle.region_id;
			$rootScope.tagGeo = salle.classroom_name;

			// Certaines salles ayant le même ID, on a besoin de connaître le pays considéré
			if(salle.classroom_city == 'London'){
				paysActuel = 'Angleterre';
				filtreGeo.pays='UK';
			}
			else if(salle.classroom_city == 'Genève' || salle.classroom_city == 'Zürich'){
				paysActuel = 'Suisse';
				filtreGeo.pays='CH';
			}
			else if(salle.classroom_city == 'Montreal' || salle.classroom_city == 'Montréal'){
				paysActuel = 'Canada';
				filtreGeo.pays='CA';
			}
			else if(salle.classroom_city == 'Barcelona'){
				paysActuel = 'Espagne';
				filtreGeo.pays='ES';
			}
			else{
				paysActuel = 'France';
				filtreGeo.pays='FR';
			}

			// et à partir de cet ID, on obtient l'objet région pour afficher les salles de la région
			$http.get(apiURL+'/classroom/region_id='+filtreGeo.region).then(function(response){
				salles = response.data
				for(index in salles){
					var salle = salles[index];
					var marqueur = L.marker([salle.classroom_gps_lat, salle.classroom_gps_lon], {icon:iconeSalle,title:salle.classroom_name, riseOnHover:true});
					marqueur.on('click', onSalleClick);
					// On affecte une nouvelle propriété au marqueur : classroom_id (pour connaître la salle cliquée)
					marqueur.classroom_id = salle.classroom_id;
					marqueur.classroom_name = salle.classroom_name;
					featureGroupSalles.addLayer(marqueur);
					afficherMarqueursSalles();
				}
				afficherPopUpSalle();
			});
		});

	}
}

function getContenuPopUp(infoSalle){
	var tempHTML;
	var optionsSalle = '<ul class="infos_liste fa-ul">';
	if(infoSalle.classroom_feature_shower == 1){
		optionsSalle = optionsSalle + '<li class="inline_li"><i class="fa fa-tint fa-lg" aria-hidden="true"></i>Douche</li>';
	}
	if(infoSalle.classroom_feature_parking == 1){
		optionsSalle = optionsSalle + '<li class="inline_li"><i class="fa fa-car fa-lg" aria-hidden="true"></i>Parking</li>';
	}
	if(infoSalle.classroom_feature_locker == 1){
		optionsSalle = optionsSalle + '<li class="inline_li"><i class="fa fa-lock fa-lg" aria-hidden="true"></i>Vestiaires</li>';
	}
	if(infoSalle.classroom_feature_credit == 1){
		optionsSalle = optionsSalle + '<li class="inline_li"><i class="fa fa-credit-card fa-lg" aria-hidden="true"></i>CB</li>';
	}
	optionsSalle = optionsSalle+'</ul>';

	var mainHTML = '<div class="panel panel-default"><div class="header_salle panel-heading clearfix"><strong class="salle_title">'+infoSalle.classroom_name+'</strong><button type="button" class="btn btn-default pull-right" data-ng-click="goToCalendrier()"><span class="glyphicon glyphicon-calendar"></span></button></div><div class="row panel-body"><div><span class="popup glyphicon glyphicon-home" aria-hidden="true"></span>'+infoSalle.classroom_address+' '+infoSalle.classroom_zip+' '+infoSalle.classroom_city+'</div><br/><div>'+optionsSalle+'</div><div class="classroom_description well">'+infoSalle.classroom_description+'</div></div><div class="panel-footer"><img src="'+infoSalle.classroom_photo_url+'" onerror="this.src=\'https://design.gymsuedoise.com/USER20160406/location/location_defaultpic.jpg\';" width="300" alt ="Photo de la salle"></div></div>';
// Nécessité de compiler les directives angular avant de les passer dans le DOM
var compiledHTML = $compile(mainHTML)($scope);
popUpSalle.setContent(compiledHTML[0]);
popUpSalle.bringToFront();
}

$scope.goToCalendrier = function() {
	$rootScope.currentPage= 'calendrier.html';
};

$rootScope.$on('retraitFiltre', function(event) {
	$scope.sallesSelectionnees = [];
	initAll();
});

// A l'ouverture d'une pop-up, on centre la carte sur cette dernière
function centrerPopUp(e){
	console.log('CENTRAAAGE !');
	var px = carte.project(e.popup._latlng); 
	px.y -= e.popup._container.clientHeight/2;
	carte.panTo(carte.unproject(px),{animate: true});
}

	//$scope.listeProfs = null;
	$scope.listeSalles = null;
	$scope.salleCourante = null;

	// Bricolage pour afficher les profs temporairement
	$scope.varTemp1 = filtreTempo.time_range;
	$scope.varTemp2 = filtreGeo.pays;
	$scope.varTemp3 = filtreGeo.gps_range;
	$scope.varTemp4 = filtreGeo.region;
	$scope.varTemp5 = filtreGeo.salle;

	filtreTempo.time_range='';
	filtreGeo.pays='';
	filtreGeo.gps_range='';
	filtreGeo.region='';
	filtreGeo.salle='';
	
	filtreService.getSalles().then(function(response) { $scope.listeSalles = response.data; });

	filtreTempo.time_range = $scope.varTemp1;
	filtreGeo.pays=$scope.varTemp2;
	filtreGeo.gps_range=$scope.varTemp3;
	filtreGeo.region=$scope.varTemp4;
	filtreGeo.salle=$scope.varTemp5;


	$scope.changerSalleRecherche=function(value) {
		$scope.salleRecherche = value;
	}


	$scope.indexOfClassroomSelected=function(classroom) {
		for (var i=0; i<$scope.sallesSelectionnees.length; i++) {
			$scope.c = $scope.sallesSelectionnees[i];

			if ($scope.c.classroom_id == classroom.classroom_id) {
				return i;
			}
		}

		return -1;
	}

	$scope.addOrRemoveClassroom=function(classroom){
		var index = $scope.indexOfClassroomSelected(classroom); 

		if (index > -1)
			$scope.sallesSelectionnees.splice(index, 1);
		else
			$scope.sallesSelectionnees.push(classroom);


		// Annulation de la selection multiple
		var autoriserSelectionMultiple = false;
		if (!autoriserSelectionMultiple)
			$scope.sallesSelectionnees.splice(0, $scope.sallesSelectionnees.length - 1);


		// Mise à jour du filtre géo
		if ($scope.sallesSelectionnees.length > 0) {
			$scope.salleTemp = $scope.sallesSelectionnees[$scope.sallesSelectionnees.length-1];
			filtreGeo.salle = $scope.salleTemp.classroom_id;
			filtreGeo.pays = $scope.getCountryCodeFromCity($scope.salleTemp.classroom_city);
			$rootScope.tagGeo = $scope.salleTemp.classroom_name;
		} 
		else {
			$scope.resetCarte();
		}
	}
	
	$scope.getCountryCodeFromCity=function(city){
		if (city == "London")
			return "UK";
		else if (city == "Barcelona")
			return "ES";
		else if (city == "Genève" || city == "Zürich")
			return "CH";
		else if (city == "Montréal")
			return "CA";
		else
			return "FR";
	};

	$scope.getCountryFromCity=function(city){
		if (city == "London")
			return "Royaume-Uni";
		else if (city == "Barcelona")
			return "Espagne";
		else if (city == "Genève" || city == "Zürich")
			return "Suisse";
		else if (city == "Montréal")
			return "Canada";
		else
			return "France";
	};

	$scope.changerSalleCourante=function(salle){
		$scope.salleCourante = salle;
	};

	$scope.remoteUrlRequestFn=function(str){
		return{str};
	};

});