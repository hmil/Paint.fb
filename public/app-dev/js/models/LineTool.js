define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.LineTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'line'
		},
		
		initialize: function(){
			this.p1 = {x: 0, y:0};
			
			this.properties = ['color1', 'lineWidth'];
		},
		
		onMousedown: function(e){	
			this.p1 = {x: e.x, y: e.y};
		},
		
		onMouseup: function(e){	
			this.sendAction({
				p1: this.p1,
				p2: {x: e.x, y: e.y},
				
				//Propriétés nécessaires pour cet outil
				properties: this.properties
			});
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
		
		drawAction: function(act, ctx){
			
			this.updateContext(ctx, act.properties);
			this.drawLine(ctx, act.p1, act.p2);
			
			//Et on nettoie le buffer
			this.env.clearBuf();
			
		},
		
		updateContext: function(ctx, properties){
			properties = this.getCleanedProperties(this.properties, properties);
			
			ctx.strokeStyle = properties.color1;
			ctx.lineWidth = properties.lineWidth;
			ctx.lineCap = 'round';
		}
	
	});

});