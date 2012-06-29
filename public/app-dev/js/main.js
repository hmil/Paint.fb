require([
	"jquery",
	"lib/underscore",
	"lib/backbone",
	"lib/jquery-ui",
	"app",
	"models/Facebook",
	"models/Discussion",
	"collections/Discussions",
	"views/main"],
	function($) {
		//Toutes les dépendences ont été chargées
		$(function() {
			//Initialisation de l'application
			app.init();
		});
});