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
		
		sendAction: function(options){
			options.tool = this.id;
			
			options.properties = this.getCleanedProperties(options.properties);
			
			this.env.sendAction(options);
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