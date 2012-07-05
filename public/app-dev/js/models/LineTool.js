define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.LineTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'line'
		},
		
		initialize: function(){
		}
	
	});

});