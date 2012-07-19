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
			}).on('colorChanged', function(col){
			
				this.bufferCtx.strokeStyle = col;
				
			}, this);
			
			this.tool = app.collections.tools.first();
			
			this.canvas = this.$('#canvas');
			this.buffer = this.$('#buffer')
			
				.mousedown(function(evt){
					_this.tool.onMousedown(_this.makeEvent(evt));
					
					$(window).on('mousemove.tracking', function(e){
					
						_this.tool.onMousemove(_this.makeEvent(e));
					})
					
					.on('mouseup.tracking', function(e){
						_this.tool.onMouseup(_this.makeEvent(e));
						
						$(window).off('mouseup.tracking mousemove.tracking');
					});
					
				});
			
			this.canvasCtx = this.canvas.get()[0].getContext('2d');
			this.bufferCtx = this.buffer.get()[0].getContext('2d');
			
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
			else{
				console.log("choix de l'outil : "+toolName);
				this.tool = tool;
			}
		},
		
		adjustWidth: function(width){
			this.canvas.width(width - this.toolBox.width());
			this.buffer.width(width - this.toolBox.width());
		},

		makeEvent: function(evt){
			return {
				x: Math.round((evt.pageX - this.buffer.offset().left)*this.buffer.attr('width')/this.buffer.width()),
				y: Math.round((evt.pageY - this.buffer.offset().top)*this.buffer.attr('height')/this.buffer.height()),
				
				canvas: this.canvasCtx,
				buffer: this.bufferCtx
			};
		}
	});
});