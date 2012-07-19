define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.PaintTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'paint'
		},
		
		initialize: function(){
		},
		
		onMousedown: function(e){
			e.buffer.beginPath();
			e.buffer.moveTo(e.x, e.y);
		},
		
		onMouseup: function(e){
		},
		
		onMousemove: function(e){
			e.buffer.lineTo(e.x, e.y);
			e.buffer.stroke();
		}
	
	});

});