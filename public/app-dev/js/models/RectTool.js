define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.RectTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'rect'
		},
		
		initialize: function(){
			this.p1 = {x: 0, y:0};
		},
		
		onMousedown: function(e){	
			this.p1 = {x: e.x, y: e.y};
		},
		
		onMouseup: function(e){	
			//initialisation du canvas
			e.applyStyle();
			
			//Dessin du trajet
			this.drawRect(e.canvas, this.p1, {x: e.x, y: e.y});
			
			//Et on nettoie le buffer
			e.clearBuf();
		},
		
		onMousemove: function(e){			
			//On nettoie le buffer
			e.clearBuf();

			//Et on redessine la ligne
			this.drawRect(e.buffer, this.p1, {x: e.x, y: e.y});
		},
		
		drawRect: function(ctx, p1, p2){
			ctx.strokeRect(p1.x, p1.y, p2.x-p1.x, p2.y - p1.y);
		}
	
	});

});