define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.PaintTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'paint'
		},
		
		initialize: function(){
			this.path = new Array();
		},
		
		onMousedown: function(e){
			e.buffer.beginPath();
			e.buffer.moveTo(e.x, e.y);
			
			this.path.push({x: e.x, y: e.y});
		},
		
		onMouseup: function(e){	
			//initialisation du canvas
			e.applyStyle();
			
			//Dessin du trajet
			this.drawPath(e.canvas, this.path);
			
			//on réinitialise le tableau mémoire
			this.path.length = 0;
			
			//Et on nettoie le buffer
			e.clearBuf();
		},
		
		onMousemove: function(e){
			//On ajoute la nouvelle coordonnée
			this.path.push({x: e.x, y: e.y});
			
			//On nettoie le buffer
			e.clearBuf();

			//Et on redessine le chemin
			this.drawPath(e.buffer, this.path);
		},
		
		drawPath: function(ctx, path){
			ctx.beginPath();
			
			for(var i = 0 ; i < this.path.length ; i++){
				ctx.lineTo(this.path[i].x, this.path[i].y);
			}
			
			ctx.stroke();
		}
	
	});

});