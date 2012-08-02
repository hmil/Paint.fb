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
			this.sendAction({
				p1: this.p1,
				p2: {x: e.x, y: e.y},
				
				//Propriétés nécessaires pour cet outil
				properties: ['color', 'lineWidth']
			});
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
		
		drawAction: function(act, ctx){
			this.updateContext(ctx, act.properties);
			this.drawRect(ctx, act.p1, act.p2);
			
			//Et on nettoie le buffer
			this.env.clearBuf();
		},
		
		updateContext: function(ctx, properties){
			properties = this.getCleanedProperties(['color', 'lineWidth'], properties);
			
			ctx.strokeStyle = properties.color;
			ctx.lineWidth = properties.lineWidth;
			ctx.lineCap = 'square';
			ctx.lineJoin = 'miter';
		}
	});

});