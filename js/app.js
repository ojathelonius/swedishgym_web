// PROJET VISUALISATION 2
// VERSION 1.0 - 08/06/2015

var app = angular.module('mainApp', ['ngSanitize']);
// Variable globale pour l'URL par défaut de l'API 
var apiURL = "http://johanet.fr/front_api.php";
// API en local
// var apiURL = "../restapi/front_api.php";
// Objet filtre global partagé par toutes les vues
var filtreService;
var filtreGeo, filtreTempo, filtreConflit, filtreIntensite, filtreStaff;

// Zoom par défaut - niveau Europe centrale
var zoom_default = 5;
// Centre de l'Europe par défaut
var center_europe_default =  [47.040182,3.427734];
// Conservation du pays actuellement sélectionné pour le récupérer au changement de vue
var paysActuel;



// Factory FiltreService pour la gestion de tous les filtres
app.factory('FiltreService', function ($http) {

	function FiltreService(valFiltreGeo, valFiltreTempo, valFiltreConflit, valFiltreStaff, valFiltreIntensite) {
		this.filtreGeo = valFiltreGeo;
		this.filtreTempo = valFiltreTempo;
		this.filtreConflit = valFiltreConflit;
    this.filtreStaff = valFiltreStaff;
    this.filtreIntensite = valFiltreIntensite;
  }
  FiltreService.prototype.getCours = function (count) {
    var url;
    if(count){
     url=apiURL+"/countclass/";
   }
   else{
     url = apiURL+"/class/";
   }
   url=url+getConcatURL([filtreGeo.getCours(), filtreTempo.getCours(), filtreConflit.getCours(), filtreStaff.getCours(), filtreIntensite.getCours()]);
   return $http.get(url);
 };

 FiltreService.prototype.getSalles = function (count) {
  var url = '';
  if(count){
   url=apiURL+"/countclassroom/";
 }
 else{
   url = apiURL+"/classroom/";
 }

		url=url+getConcatURL([filtreGeo.getSalles()]); // On inclut uniquement le filtreGeo car on veut afficher toutes les salles dans tous les cas
    return $http.get(url);
  };

  FiltreService.prototype.getRegions = function (count) {
   var url = '';
   if(count){
    url=apiURL+"/countregion/";
  }
  else{
    url = apiURL+"/region/";
  }

  url=url+getConcatURL([filtreGeo.getRegions()]);

   return $http.get(url);
 };

 FiltreService.prototype.getStaff = function (count) {
   var url = '';
   if(count){
    url=apiURL+"/countstaff/";
  }
  else{
    url = apiURL+"/staff/";
  }

  url=url+getConcatURL([filtreGeo.getStaff(), filtreTempo.getStaff(), filtreStaff.getStaff()]);

    return $http.get(url);
  };
  return FiltreService;
});

// Factory FiltreGeo pour la gestion des filtres géographiques
app.factory('FiltreGeo', function ($http) {

	function FiltreGeo(valPays, valGps, valRegion, valSalle) {
		this.pays = valPays;
		this.gps_range = valGps;
		this.region = valRegion;
		this.salle = valSalle;
	}
	FiltreGeo.prototype.getCours = function () {
		var url = '';
    // Si un filtre de salle est précisé, alors on ne considère que celui-ci pour ne pas surcharger la requête
    if(filtreGeo.salle != '')
    {
    	if(url!=''){
    		url=url+"&";
    	}
    	url = url+"classroom_id="+filtreGeo.salle;
    }
    // Sinon on considère les filtres géographiques de manière classique
    else
    { 
    	if(filtreGeo.gps_range != '')
    	{
    		if(url!=''){
    			url=url+"&";
    		}
    		url = url+"gps_range="+filtreGeo.gps_range;
    	}
    	if(filtreGeo.pays != '')
    	{
    		if(url!=''){
    			url=url+"&";
    		}
    		url = url+"pays="+filtreGeo.pays;
    	}
    	if(filtreGeo.region != '')
    	{
    		if(url!=''){
    			url=url+"&";
    		}
    		url = url+"region="+filtreGeo.region;
    	}
    }
    return url;
  };


  FiltreGeo.prototype.getSalles = function () {
   var url = '';
 // Si un filtre de salle est précisé, alors on ne considère que celui-ci pour ne pas surcharger la requête
 if(filtreGeo.salle != '')
 {
 	if(url!=''){
 		url=url+"&";
 	}
 	url = url+"classroom_id="+filtreGeo.salle;
 }
 else{
   // Si un filtre géographique est précisé
   if(filtreGeo.gps_range != '')
   {
   	if(url!=''){
   		url=url+"&";
   	}
   	url = url+"gps_range="+filtreGeo.gps_range;
   }
   if(filtreGeo.pays != '')
   {
   	if(url!=''){
   		url=url+"&";
   	}
   	url = url+"pays="+filtreGeo.pays;
   }
   if(filtreGeo.region != '')
   {
   	if(url!=''){
   		url=url+"&";
   	}
   	url = url+"region="+filtreGeo.region;
   }
 }
 return url;
};

FiltreGeo.prototype.getRegions = function () {
	var url = '';
	if(filtreGeo.pays != '')
	{
		if(url!=''){
			url=url+"&";
		}
		url = url+"region_country_code="+filtreGeo.pays;
	}
	if(filtreGeo.region != '')
	{
		if(url!=''){
			url=url+"&";
		}
		url = url+"region_id="+filtreGeo.region;
	}
	return url;
};

FiltreGeo.prototype.getStaff = function() {
	var url = '';
// Si un filtre de salle est précisé, alors on ne considère que celui-ci pour ne pas surcharger la requête
if(filtreGeo.salle != '')
{
	if(url!=''){
		url=url+"&";
	}
	url = url+"classroom_id="+filtreGeo.salle;
}
else{
   // Si un filtre géographique est précisé
   if(filtreGeo.gps_range != '')
   {
   	if(url!=''){
   		url=url+"&";
   	}
   	url = url+"gps_range="+filtreGeo.gps_range;
   }
   if(filtreGeo.pays != '')
   {
   	if(url!=''){
   		url=url+"&";
   	}
   	url = url+"pays="+filtreGeo.pays;
   }
   if(filtreGeo.region != '')
   {
   	if(url!=''){
   		url=url+"&";
   	}
   	url = url+"region="+filtreGeo.region;
   }
 }
 return url;
};
FiltreGeo.prototype.retirerTout = function() {
	this.pays = '';
	this.region = '';
	this.gps_range = '';
	this.salle = '';
};

return FiltreGeo;
});

// Factory FiltreTempo pour la gestion des filtres temporels
app.factory('FiltreTempo', function ($http) {

	function FiltreTempo(val_time_range) {
		this.time_range = val_time_range;
	}

	FiltreTempo.prototype.getCours = function () {
		var url = '';
    // Si un filtre géographique est précisé
    if(filtreTempo.time_range != '')
    {
    	url = url+"time_range="+filtreTempo.time_range;
    }
    return url;
  };


  FiltreTempo.prototype.getSalles = function () {
   var url = '';
    // Si un filtre géographique est précisé
    if(filtreTempo.time_range != '')
    {
    	url = url+"time_range="+filtreTempo.time_range;
    }
    return url;
  };

  FiltreTempo.prototype.getStaff = function () {
   var url = '';
    // Si un filtre géographique est précisé
    if(filtreTempo.time_range != '')
    {
    	url = url+"time_range="+filtreTempo.time_range;
    }
    return url;
  };

  return FiltreTempo;
});

// Factory FiltreConflit pour la gestion des filtres conflit
app.factory('FiltreConflit', function ($http) {

  function FiltreConflit(val_conflit) {
    this.conflit = val_conflit;
  }

  FiltreConflit.prototype.getCours = function () {
    var url = '';
    // Si un filtre conflit est précisé
    if(filtreConflit.conflit != '')
    {

      url = url+"filter="+filtreConflit.conflit;


    }
    return url;
  };

  return FiltreConflit;
});
// Factory FiltreStaff pour la gestion des filtres staff
app.factory('FiltreStaff', function ($http) {

  function FiltreStaff(val_host, val_teacher, val_nom, val_staff) {
    this.host = val_host;
    this.teacher = val_teacher;
    this.nom = val_nom;
    this.staff = val_staff;
  }

  FiltreStaff.prototype.getCours = function () {
    var url = '';
    // Si un filtre conflit est précisé
    if(filtreStaff.host != '')
    {
      if(url!=''){
        url=url+"&";
      }
      url = url+"host="+filtreStaff.host;
    }
    if(filtreStaff.teacher != '')
    {
      if(url!=''){
        url=url+"&";
      }
      url = url+"teacher="+filtreStaff.teacher;
    }
    if(filtreStaff.nom != '')
    {
      if(url!=''){
        url=url+"&";
      }
      url = url+"nom="+filtreStaff.nom;
    }
    if(filtreStaff.staff != '')
    {
      if(url!=''){
        url=url+"&";
      }
      url = url+"staff="+filtreStaff.staff;
    }
    return url;
  };
  FiltreStaff.prototype.getStaff = function () {
    var url = '';
    if(filtreStaff.nom != '')
    {
      if(url!=''){
        url=url+"&";
      }
      url = url+"nom="+filtreStaff.nom;
    }
    return url;
  };

  return FiltreStaff;
});


// Factory FiltreIntensite pour préciser les intensités
app.factory('FiltreIntensite', function ($http) {

  function FiltreIntensite(val_intensite) {
    this.intensite = val_intensite;
  }

  FiltreIntensite.prototype.getCours = function () {
    var url = '';
    // Si un filtre sup est précisé
    if(filtreIntensite.intensite != '')
    {
      url = url+"class_level="+filtreIntensite.intensite;


    }
    return url;
  };

  return FiltreIntensite;
});


// Renvoie l'URL correctement concaténée (séparation des filtres avec '&')
function getConcatURL(arrayFiltre){
  var tempURL = '';
  tempURL = arrayFiltre.join('&');
  if(tempURL.charAt(0) === '&' )
  {
    tempURL = tempURL.slice(1);
  }
  // Suppression des & supplémentaires (car join sur des éléments vides)
  tempURL = tempURL.replace('&&&&', '&');
  tempURL = tempURL.replace('&&&', '&');
  tempURL = tempURL.replace('&&', '&');
  if(tempURL.charAt(tempURL.length-1) === '&'){
    tempURL = tempURL.substring(0, tempURL.length-1);
  }
  if (tempURL != null && tempURL.length > 0 && tempURL.charAt(tempURL.length-1)=='&') {
    tempURL = tempURL.substring(0, tempURL.length-1);
  }
  return tempURL;
}