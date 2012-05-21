require([
	"jquery",
	"lib/underscore",
	"lib/backbone",
	"app",
	"models/Facebook"], function($) {
    //Toutes les dépendences ont été chargées
    $(function() {
		/*On cache le chargement avant d'initialiser l'application car 
		celle-ci va modifier le contenu en initialisant les views*/
		$('#loading_main').hide();
		//Initialisation de l'application
        app.init();
    });
});