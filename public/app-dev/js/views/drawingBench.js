define([
	'app', 
	'lib/backbone', 
	'lib/underscore', 
	'lib/jquery-ui',
	'models/DrawingEvent',
	'collections/Tools',
	'views/propertyBox'
], function(app){

	app.Views.drawingBench = Backbone.View.extend({
	
		initialize : function(){
			//On stocke this dans une variable locale pour s'en servir plus tard
			var _this = this;
			
			/* On génère le contenu grâce à la template */
			this.$el = $(_.template($('#tp_drawingBench').html())());
			
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
			
			this.canvasCtx = false; //On initialise le contexte de canvas à false car on veux utiliser le contexte spécifique à la discussion

			this.bufferCtx = this.buffer.get()[0].getContext('2d');
			
			/* initialisation de la propertybox */
			this.propertyBox = new app.Views.PropertyBox({
				el: this.$('#propertyBox')
			});
			
			//Lors d'un changement dans le modèle des propriétés
			this.propertyBox.properties
				.on('change', function(model, c){
					
					//On applique ce changement sur le contexte du buffer
					for(var i in c.changes){
						this.bufferCtx[i] = model.get(i);
					}
					
					//Et on rafraîchit la preview de la brush
					this.propertyBox.refreshBrushPreview(this.buffer.attr('width')/this.buffer.width());
					
				}, this)
				
				//Initialise le contexte grâce au modèle properties
				.initContext(this.bufferCtx);
		
			
			this.$el.find('.toolButton').click(function(){
				_this.switchTool($(this).attr('data-tool'));
			});

			this.tool = app.collections.tools.first();
				
			this.toolBox = this.$('#toolBox');
			
			app.views.contentArea.on('resized', this.adjustSize, this);
			
			
			/*	On déclare la variable discuss qui contiens la discussion actuellement affichée 
				mais on ne l'initialise pas. */
			this.discuss = false;

			//Objet servant de base aux évènements envoyés aux outils
			this.eventObj = new app.Models.DrawingEvent({
				buffer: this.bufferCtx,
				canvas: this.canvasCtx,
				dimentions: {
					w: this.canvas.attr('width'),
					h: this.canvas.attr('height')
				}
			});
			
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
				
				this.toolBox.children().removeClass('active');
				this.toolBox.find('[data-tool="'+toolName+'"]').addClass('active');
			}
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
			this.eventObj.x = Math.round((evt.pageX - this.buffer.offset().left)*this.buffer.attr('width')/this.buffer.width());
			this.eventObj.y = Math.round((evt.pageY - this.buffer.offset().top)*this.buffer.attr('height')/this.buffer.height());
			
			return this.eventObj;
		}
	});
});