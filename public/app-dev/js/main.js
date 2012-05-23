require([
	"jquery",
	"lib/underscore",
	"lib/backbone",
	"app",
	"models/Facebook",
	"views/main"], function($) {
    //Toutes les dépendences ont été chargées
    $(function() {
		//Initialisation de l'application
        app.init();
    });
});