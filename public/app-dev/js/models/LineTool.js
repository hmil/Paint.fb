define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.LineTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'line'
		},
		
		initialize: function(){
			this.p1 = {x: 0, y:0};
		},
		
		onMousedown: function(e){	
			this.p1 = {x: e.x, y: e.y};
		},
		
		onMouseup: function(e){	
			//initialisation du canvas
			e.canvas.strokeStyle = e.buffer.strokeStyle;
			
			//Dessin du trajet
			this.drawLine(e.canvas, this.p1, {x: e.x, y: e.y});
			
			//Et on nettoie le buffer
			e.clearBuf();
		},
		
		onMousemove: function(e){			
			//On nettoie le buffer
			e.clearBuf();

			//Et on redessine la ligne
			this.drawLine(e.buffer, this.p1, {x: e.x, y: e.y});
		},
		
		drawLine: function(ctx, p1, p2){
			ctx.beginPath();
			
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			
			ctx.stroke();
		}
	
	});

});