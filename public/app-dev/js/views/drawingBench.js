define([
	'app', 
	'lib/backbone', 
	'lib/underscore', 
	'lib/jquery-ui',
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
				
			this.toolBox = this.$('#toolBox');
			
			app.views.contentArea.on('resized', this.adjustWidth, this);
			
			
			/*	On déclare la variable discuss qui contiens la discussion actuellement affichée 
				mais on ne l'initialise pas. */
			this.discuss = false;

			
			this.canvasCtx = false; //On initialise le contexte de canvas à false car on veux utiliser le contexte spécifique à la discussion
			
			this.bufferCtx = this.buffer.get()[0].getContext('2d');
			
			//configuration
			this.bufferCtx.strokeStyle = '#000000';
			this.bufferCtx.lineWidth = 5;
			this.bufferCtx.lineCap = 'round';
			this.bufferCtx.lineJoin = 'round';
			
			this.canvasDim = {
				w: this.canvas.attr('width'),
				h: this.canvas.attr('height')
			};
			
			//Objet servant de base aux évènements envoyés aux outils
			//TODO : placer l'évènement dans un modèle
			this.eventObj = {
				x: 0,
				y: 0,
				
				buffer: this.bufferCtx,
				canvas: this.canvasCtx,
				
				canvasDim: this.canvasDim,
				
				clearBuf: function(){
					_this.bufferCtx.clearRect(0,0, _this.canvasDim.w, _this.canvasDim.h);
				},
				
				applyStyle: function(){
					_this.canvasCtx.lineWidth = _this.bufferCtx.lineWidth;
					_this.canvasCtx.strokeStyle = _this.bufferCtx.strokeStyle;
					_this.canvasCtx.lineCap = _this.bufferCtx.lineCap;
					_this.canvasCtx.lineJoin = _this.bufferCtx.lineJoin;
				}
			};
			
			
			//TODO : déplacer dans la vue appropriée
			this.$('#brushSizeSlider').slider({
				min: 1,
				max: 50,
				value: 5,
				slide: function(event, ui){
					_this.$('#brushSizeInput').val(ui.value);
					_this.bufferCtx.lineWidth = ui.value;
				}
			});
			
			this.$('#brushSizeInput').focusout(function(){
				if(isNaN($(this).val()) || $(this).val() > 50 || $(this).val() < 1){
					$(this).val(_this.$('#brushSizeSlider').slider('value'));
				}
				else{
					_this.$('#brushSizeSlider').slider('value', $(this).val());
					_this.bufferCtx.lineWidth = ui.value;
				}
			}).val(5);
		},
		
		getBench: function(discuss){	
			if(discuss.cid != this.discuss.cid){
				this.discuss = discuss;
				
				if(!discuss.canvas){
					discuss.canvas = this.canvas.clone();
				}
				else{
					//dans tout les cas, il faut adapter la largeur du canvas
					discuss.canvas.width(this.canvas.width());
				}
				
				this.$el.find('#canvas').replaceWith(discuss.canvas);
				this.canvasCtx = discuss.canvas.get()[0].getContext('2d');
				
				this.eventObj.canvas = this.canvasCtx;
			}
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
			
			//On resize aussi le canvas de la discussion en cours
			if(this.discuss)	
				this.discuss.canvas.width(width - this.toolBox.width());
		},

		makeEvent: function(evt){
			this.eventObj.x = Math.round((evt.pageX - this.buffer.offset().left)*this.buffer.attr('width')/this.buffer.width());
			this.eventObj.y = Math.round((evt.pageY - this.buffer.offset().top)*this.buffer.attr('height')/this.buffer.height());
			
			return this.eventObj;
		}
	});
});