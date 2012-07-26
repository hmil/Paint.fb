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
			var canvas = this.env.get('canvas');
			//initialisation du canvas
			this.updateContext(canvas);
			
			//Dessin du trajet
			this.drawRect(canvas, this.p1, {x: e.x, y: e.y});
			
			//Et on nettoie le buffer
			this.env.clearBuf();
		},
		
		onMousemove: function(e){			
			//On nettoie le buffer
			this.env.clearBuf();

			//Et on redessine la ligne
			this.drawRect(this.env.get('buffer'), this.p1, {x: e.x, y: e.y});
		},
		
		drawRect: function(ctx, p1, p2){
			ctx.strokeRect(p1.x, p1.y, p2.x-p1.x, p2.y - p1.y);
		},
		
		updateContext: function(ctx){
			var properties = this.env.get('properties');
			
			//TODO : propriétés spéciales pour le rect
			ctx.strokeStyle = properties.get('color');
			ctx.lineWidth = properties.get('lineWidth');
			ctx.lineCap = 'square';
			ctx.lineJoin = 'miter';
		}
	
	});

});