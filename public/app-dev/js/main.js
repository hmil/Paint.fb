require([
	"jquery",
	"js/lib/underscore-min.js",
	"js/lib/backbone-min.js",
	"js/app.js"], function($) {
    //Toutes les dépendences ont été chargées
    $(function() {
        app.init();
    });
});