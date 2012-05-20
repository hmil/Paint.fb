require([
	"jquery",
	"lib/underscore",
	"lib/backbone",
	"app",
	"models/Facebook"], function($) {
    //Toutes les dépendences ont été chargées
    $(function() {
        app.init();
    });
});