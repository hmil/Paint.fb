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
			var canvas = this.env.get('canvas');
			//initialisation du canvas
			this.updateContext(canvas);
			
			//Dessin du trajet
			this.drawLine(canvas, this.p1, {x: e.x, y: e.y});
			
			//Et on nettoie le buffer
			this.env.clearBuf();
		},
		
		onMousemove: function(e){			
			//On nettoie le buffer
			this.env.clearBuf();

			//Et on redessine la ligne
			this.drawLine(this.env.get('buffer'), this.p1, {x: e.x, y: e.y});
		},
		
		drawLine: function(ctx, p1, p2){
			ctx.beginPath();
			
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			
			ctx.stroke();
		},
		
		updateContext: function(ctx){
			var properties = this.env.get('properties');
			
			ctx.strokeStyle = properties.get('color');
			ctx.lineWidth = properties.get('lineWidth');
			ctx.lineCap = 'round';
		}
	
	});

});