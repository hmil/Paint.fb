define([
	'app', 
	'lib/backbone', 
	'lib/underscore', 
	'collections/Tools',
	'views/colorPalette'
], function(app){

	app.Views.drawingBench = Backbone.View.extend({
	
		initialize : function(){
		
			/* On génère le contenu grâce à la template */
			this.$el = $(_.template($('#tp_drawingBench').html())());
			
			var _this = this;
			
			this.$el.find('.toolButton').click(function(){
				_this.switchTool($(this).attr('data-tool'));
			});
			
			this.palette = new app.Views.ColorPalette({
				el: this.$el.find('#colorPalette')
			});
			
			/*	On déclare la variable discuss qui contiens la discussion actuellement affichée 
				mais on ne l'initialise pas. */
			this.discuss = false;
		},
		
		getBench: function(discuss){	
			return this.$el;
		},
		
		switchTool: function(toolName){
			var tool = app.collections.tools.get(toolName);
			
			if(!tool)
				console.log('outil inexistant ('+toolName+')');
			else
				console.log("choix de l'outil : "+toolName);
		}
	});
});