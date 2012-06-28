require([
	"jquery",
	"lib/underscore",
	"lib/backbone",
	"lib/jquery-ui",
	"app",
	"models/Facebook",
	"models/Discussion",
	"collections/Discussions",
	"views/main",
	"views/menu",
	"views/friendsList",
	"views/contentArea"],
	function($) {
		//Toutes les dépendences ont été chargées
		$(function() {
			//Initialisation de l'application
			app.init();
		});
});