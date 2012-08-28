define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Models.DrawingProperties = Backbone.Model.extend({
		defaults: {
			lineWidth: 5,
			maxLineWidth: 80,
			minLineWidth: 1,
			color1: 'black',
			color2: 'white',
			font: 'Arial',
			fontSize: 20,
			maxFontSize: 200,
			minFontSize: 1,
			italic: false,
			bold: false,
			fill: false,
			stroke: true
		},
		
		initialize: function(){

		},
		
		validate: function(attrs){
			if(isNaN(attrs.lineWidth) || attrs.lineWidth > attrs.maxLineWidth || attrs.lineWidth < attrs.minLineWidth){
				return "lineWidth out of bounds";
			}
			if(isNaN(attrs.fontSize) || attrs.fontSize > attrs.maxFontSize || attrs.fontSize < attrs.minFontSize){
				return "fontSize out of bounds";
			}
		}
	
	});

});