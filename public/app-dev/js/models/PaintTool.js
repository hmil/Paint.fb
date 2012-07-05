define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.PaintTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'paint'
		},
		
		initialize: function(){
		}
	
	});

});