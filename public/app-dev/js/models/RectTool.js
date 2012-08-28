define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool'], function(app){

	app.Models.RectTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'rect'
		},
		
		initialize: function(){
			this.p1 = {x: 0, y:0};
			
			this.properties = ['color1', 'color2', 'lineWidth', 'fill', 'stroke'];
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
			this.drawRect(this.env.get('buffer'), this.p1, {x: e.x, y: e.y}, this.getCleanedProperties(this.properties));
		},
		
		drawRect: function(ctx, p1, p2, props){
			if(props.fill == true){
				ctx.fillRect(p1.x, p1.y, p2.x-p1.x, p2.y - p1.y);
			}
			if(props.stroke == true){
				ctx.strokeRect(p1.x, p1.y, p2.x-p1.x, p2.y - p1.y);
			}
		},
		
		drawAction: function(act, ctx){
			this.updateContext(ctx, act.properties);
			this.drawRect(ctx, act.p1, act.p2, act.properties);
			
			//Et on nettoie le buffer
			this.env.clearBuf();
		},
		
		updateContext: function(ctx, properties){
			properties = this.getCleanedProperties(this.properties, properties);
			
			ctx.strokeStyle = properties.color1;
			ctx.fillStyle = properties.color2;
			ctx.lineWidth = properties.lineWidth;
			ctx.lineCap = 'square';
			ctx.lineJoin = 'miter';
		}
	});

});