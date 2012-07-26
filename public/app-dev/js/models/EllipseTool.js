define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.EllipseTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'ellipse'
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
			this.drawEllipse(canvas, this.p1, {x: e.x, y: e.y});
			
			//Et on nettoie le buffer
			this.env.clearBuf();
		},
		
		onMousemove: function(e){			
			//On nettoie le buffer
			this.env.clearBuf();

			//Et on redessine la ligne
			this.drawEllipse(this.env.get('buffer'), this.p1, {x: e.x, y: e.y});
		},
		
		drawEllipse: function(ctx, p1, p2){		
			var left = (p1.x < p2.x) ? p1.x : p2.x;
			var top = (p1.y < p2.y) ? p1.y : p2.y;
			var width = Math.abs(p1.x-p2.x);
			var height = Math.abs(p1.y-p2.y);
			var xRay = width/2;
			var yRay = height/2;

			var k = 0.5522847498;

			var krx = xRay*k;
			var kry = yRay*k;

			ctx.beginPath();
			ctx.moveTo(left + xRay, top);
			ctx.bezierCurveTo(left + xRay+krx, top, left+width, top+yRay-kry, left+width, top+yRay);
			ctx.bezierCurveTo(left + width, top+yRay+kry, left+xRay+krx, top+height, left+xRay, top+height);
			ctx.bezierCurveTo(left+xRay-krx, top+height, left, top+yRay+kry, left, top+yRay);
			ctx.bezierCurveTo(left, top+yRay-kry, left+xRay-krx, top, left+xRay, top);
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