define([
	'app', 
	'lib/backbone', 
	'lib/underscore', 
	'lib/jquery-ui',
	'models/Drawing',
	'views/propertyBox'
], function(app){

	app.Views.drawingBench = Backbone.View.extend({
	
		initialize : function(){
			//On stocke this dans une variable locale pour s'en servir plus tard
			var _this = this;
			
			//On initialise le modèle de cette vue
			var model = this.model = app.models.drawing;
			
			/* On génère le contenu grâce à la template */
			this.$el = $(_.template($('#tp_drawingBench').html())());
			
			this.canvas = this.$('#canvas');
			this.buffer = this.$('#buffer')
				.mousedown(function(evt){
					model.get('tool').onMousedown(_this.makeEvent(evt));
					
					$(window).on('mousemove.tracking', function(e){
					
						model.get('tool').onMousemove(_this.makeEvent(e));
					})
					
					.on('mouseup.tracking', function(e){
						model.get('tool').onMouseup(_this.makeEvent(e));
						
						$(window).off('mouseup.tracking mousemove.tracking');
					});
					
				});
			
			//Le modèle ne contient que les contextes, pas les éléments jquery (logique MVC)
			model.set('buffer', this.buffer.get()[0].getContext('2d'))
				.set('canvasHeight', this.canvas.attr('height'))
				.set('canvasWidth', this.canvas.attr('width'))
				
				.on('change:tool', function(model, tool){
					_this.switchTool(tool);
				})
				//Lors d'un changement dans le modèle des propriétés
				.get('properties')
					.on('change', function(){
						model.get('tool').updateContext(model.get('buffer'));
						
						//Et on rafraîchit la preview de la brush
						this.propertyBox.refreshBrushPreview(this.buffer.attr('width')/this.buffer.width());
						
					}, this);
			
			/* initialisation de la propertybox */
			this.propertyBox = new app.Views.PropertyBox({
				el: this.$('#propertyBox')
			});
			
			
		
			
			this.$el.find('.toolButton').click(function(){
				model.set('tool', model.get('tools').get($(this).attr('data-tool')));
			});

			model.get('tool').updateContext(model.get('buffer'));
				
			this.toolBox = this.$('#toolBox');
			
			app.views.contentArea.on('resized', this.adjustSize, this);
			
			
			/*	On déclare la variable discuss qui contiens la discussion actuellement affichée 
				mais on ne l'initialise pas. */
			this.discuss = false;			
		},
		
		getBench: function(discuss){	
			if(discuss.cid != this.discuss.cid){
				this.discuss = discuss;
				
				if(!discuss.canvas){
					discuss.canvas = this.canvas.clone();
				}
				else{
					//dans tout les cas, il faut adapter la largeur du canvas
					discuss.canvas.width(this.canvas.width()).height(this.canvas.height());
				}
				
				this.$el.find('#canvas').replaceWith(discuss.canvas);
				this.canvasCtx = discuss.canvas.get()[0].getContext('2d');
				
				this.model.set('canvas', this.canvasCtx);
			}
			return this.$el;
		},
		
		switchTool: function(tool){
			this.toolBox.children().removeClass('active');
			this.toolBox.find('[data-tool="'+tool.get('id')+'"]').addClass('active');
			
			tool.updateContext(this.model.get('buffer'));
		},
		
		adjustSize: function(){
			var width = this.$('#drawingArea').width() - this.toolBox.width();
			
			var height = this.$('#drawingArea').height();
			
			//Les dimentions du canvas
			var cw = this.canvas.attr('width');
			var ch = this.canvas.attr('height');
			
			//Les nouvelles dimentions
			var nh, nw;
			
			//On calcule les rapports entre la taille dispo et la taille requise
			var hr = height/ch;
			var wr = width/cw;

			//Si la hauteur est le facteur limitant
			if(hr < wr){
				nh = height;
				nw = cw*nh/ch;
			}
			else{
				nw = width;
				nh = ch*nw/cw;
			}
			
			this.canvas.width(nw).height(nh);
			this.buffer.width(nw).height(nh);
			
			//On resize aussi le canvas de la discussion en cours
			if(this.discuss)	
				this.discuss.canvas.width(nw).height(nh);
				
			//On rafraichit la preview lorsque la taille du canvas change
			this.propertyBox.refreshBrushPreview(this.buffer.attr('width')/this.buffer.width());
		},

		makeEvent: function(evt){	
			return {
				x: Math.round((evt.pageX - this.buffer.offset().left)*this.buffer.attr('width')/this.buffer.width()),
				y: Math.round((evt.pageY - this.buffer.offset().top)*this.buffer.attr('height')/this.buffer.height())
			};
		}
	});
});