define([
	'app', 
	'lib/backbone', 
	'lib/underscore',
	'collections/Tools'
], function(app){

	app.Views.drawingBench = Backbone.View.extend({
		el: '#content_area',
		
		initialize : function(){
		
			/* On génère le contenu grâce à la template */
			this.contents = $(_.template($('#tp_drawingBench').html())());
			
			var _this = this;
			
			this.contents.find('.toolButton').click(function(){
				_this.switchTool($(this).attr('data-tool'));
			});
			
			/*	On déclare la variable discuss qui contiens la discussion actuellement affichée 
				mais on ne l'initialise pas. */
			this.discuss = false;
		},
		
		getBench: function(discuss){	
			this.discuss = discuss;
			
			return this.contents;
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