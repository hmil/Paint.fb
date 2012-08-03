requirejs.config({
    paths: {
        'socket.io': '../../socket.io/socket.io'
    }
});

require([
	"jquery",
	"socket.io",
	"lib/underscore",
	"lib/backbone",
	"lib/jquery-ui",
	"app",
	"models/Facebook",
	"models/Discussion",
	"models/Drawing",
	"collections/Discussions",
	"collections/Tools",
	"views/main"],
	function($) {
		//Toutes les dépendences ont été chargées
		$(function() {
			//Initialisation de l'application
			app.init();
		});
});