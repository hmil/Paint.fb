define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.PaintTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'paint'
		},
		
		initialize: function(){
			this.path = new Array();
		},
		
		onMousedown: function(e){
			var buffer = this.env.get('buffer');
			
			buffer.beginPath();
			buffer.moveTo(e.x, e.y);
			
			this.path.push({x: e.x, y: e.y});
		},
		
		onMouseup: function(e){	
			var canvas = this.env.get('canvas');
			
			//initialisation du canvas
			this.updateContext(canvas);
			
			//Dessin du trajet
			this.drawPath(canvas, this.path);
			
			//on réinitialise le tableau mémoire
			this.path.length = 0;
			
			//Et on nettoie lthis.env.buffer
			this.env.clearBuf();
		},
		
		onMousemove: function(e){
			//On ajoute la nouvelle coordonnée
			this.path.push({x: e.x, y: e.y});
			
			//On nettoie le buffer
			this.env.clearBuf();

			//Et on redessine le chemin
			this.drawPath(this.env.get('buffer'), this.path);
		},
		
		drawPath: function(ctx, path){
			ctx.beginPath();
			
			for(var i = 0 ; i < this.path.length ; i++){
				ctx.lineTo(this.path[i].x, this.path[i].y);
			}
			
			ctx.stroke();
		},
		
		updateContext: function(ctx){
			var properties = this.env.get('properties');
			
			ctx.strokeStyle = properties.get('color');
			ctx.lineWidth = properties.get('lineWidth');
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
		}
	
	});

});