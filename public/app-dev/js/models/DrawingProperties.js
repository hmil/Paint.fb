define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Models.DrawingProperties = Backbone.Model.extend({
		defaults: {
			lineWidth: 5,
			maxLineWidth: 50,
			minLineWidth: 1,
			strokeStyle: 'black',
			lineCap: 'round',
			lineJoin: 'round'
		},
		
		initialize: function(){

		},
		
		validate: function(attrs){
			if(isNaN(attrs.lineWidth) || attrs.lineWidth > attrs.maxLineWidth || attrs.lineWidth < attrs.minLineWidth){
				return "lineWidth out of bounds";
			}
		}
	
	});

});