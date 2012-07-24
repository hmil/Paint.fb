define([
	'app', 
	'lib/backbone', 
	'lib/underscore', 
	'models/Tool', 
	'models/PaintTool', 
	'models/LineTool',
	'models/RectTool',
	'models/EllipseTool',
	'models/TextTool'
	
	], function(app){

	app.Collections.Tools = Backbone.Collection.extend({
		
		model: app.Models.Tool,
		
		initialize: function(){
			this.add([
					new app.Models.PaintTool(),
					new app.Models.LineTool(),
					new app.Models.RectTool(),
					new app.Models.EllipseTool(),
					new app.Models.TextTool()
			]);
		
		}
	
	});

});