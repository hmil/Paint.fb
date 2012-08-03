define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Models.Tool = Backbone.Model.extend({
		
		defaults: {
		},
		
		initialize: function(){
			
		},
		
		onMousedown: function(){
		
		},
		
		onMouseup: function(){
		
		},
		
		onMousemove: function(){
		
		},
		
		updateContext: function(ctx){
			return ctx;
		},
		
		sendAction: function(data){
			data.properties = this.getCleanedProperties(data.properties);
			
			var action = {
				tool: this.id,
				data: data
			};
			
			this.env.sendAction(action);
		},
		
		drawAction: function(action, ctx){
		},
		
		getCleanedProperties: function(props, obj){
			//Si l'objet fourni est vide, on en fait un tableau
			if(typeof(obj) == 'undefined')
				obj = {};
			
				
			var envProps = this.env.get('properties');

			_.each(props, function(p){
				if(typeof(obj[p]) == 'undefined')
					obj[p] = envProps.get(p);
			});
		
			return obj;
		}
	});

});