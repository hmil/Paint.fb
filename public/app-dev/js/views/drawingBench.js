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
			
			this.canvas = this.$('#canvas');
			this.buffer = this.$('#buffer').mousedown(function(){
				//TODO : dessin
			});
			
			
			this.toolBox = this.$('#toolBox');
			
			app.views.contentArea.on('resized', this.adjustWidth, this);
			
			/*	On déclare la variable discuss qui contiens la discussion actuellement affichée 
				mais on ne l'initialise pas. */
			this.discuss = false;
		},
		
		getBench: function(discuss){	
			this.discuss = discuss;
			return this.$el;
		},
		
		switchTool: function(toolName){
			var tool = app.collections.tools.get(toolName);
			
			if(!tool)
				console.log('outil inexistant ('+toolName+')');
			else
				console.log("choix de l'outil : "+toolName);
		},
		
		adjustWidth: function(width){
			this.canvas.width(width - this.toolBox.width());
			this.buffer.width(width - this.toolBox.width());
		}
	});
});