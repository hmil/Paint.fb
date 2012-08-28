define([
	'app', 
	'lib/backbone', 
	'lib/underscore',
	'views/colorPalette',
	'models/drawingProperties'
], function(app){

	app.Views.PropertyBox = Backbone.View.extend({
		
		initialize : function(){
			var _this = this;
			
			//TODO : convertir en variable locale
			this.properties = app.models.drawing.get('properties');
			
			this.properties
				.on('change:lineWidth', function(model, width){
					this.brushSizeInput.val(width);
					this.brushSizeSlider.slider('value', width);
				}, this)
				.on('change:fontSize', function(model, size){
					this.fontSizeInput.val(size);
					this.fontSizeSlider.slider('value', size);
				}, this);
			
			
			//On référence les différentes boites à propriétés
			this.items = this.$('.propertyItem');
			
			//Lorsque l'on change d'outil, il faudra afficher ou masquer certaines propriétés
			app.models.drawing.on('change:tool', function(model, tool){
				_this.updateLayout(tool);
			});
			//Et on rafraîchit au démarrage
			this.updateLayout(app.models.drawing.get('tool'));
			
			/* Initialisation de la palette de couleurs */
			this.palette = new app.Views.ColorPalette({
				el: this.$el.find('#colorPalette')
			})
			.on('color1Changed', function(col){
				this.properties.set({color1: col});
			}, this)
			.on('color2Changed', function(col){
				this.properties.set({color2: col});
			}, this);
			
			
			/* Initialisation du contrôle de largeur de trait */
			
			this.brushSizeSlider = this.$('#brushSizeSlider').slider({
				min: this.properties.get('minLineWidth'),
				max: this.properties.get('maxLineWidth'),
				value: this.properties.get('lineWidth'),
				slide: function(event, ui){	
					_this.properties.set({lineWidth: ui.value}, {
						error: function(){
							_this.brushSizeSlider.val(_this.properties.get('lineWidth'));
						}
					}); 
				}
			});
			
			this.brushSizeInput = this.$('#brushSizeInput').on('change', function(){
				_this.properties.set({lineWidth: $(this).val()}, {
					error: function(){
						_this.brushSizeInput.val(_this.properties.get('lineWidth'));
					}
				}); 				
			})
			.val(this.properties.get('lineWidth'));
			
			/* Initialisation de la preview de brosse */
			
			this.brushPreview = this.$('#brushPreview').get()[0].getContext('2d');
			
			
			/* Initialisation des checkbox de remplissage/contour */
			
			this.$('.fillSwitch').change(function(e){
				_this.properties.set($(this).val(), $(this).is(':checked'));
			});
			
			/* Initialisation du select de polices */
			
			this.fontFamily = this.$('#fontFamily').on('change', function(){
				_this.properties.set('fontFamily', $(this).val());
				$(this).css('font-family', $(this).val());
			});
			
			
			/* contrôle de taille de police */
			
			this.fontSizeInput = this.$('#fontSizeInput').on('change', function(){
				_this.properties.set({fontSize: $(this).val()}, {
					error: function(){
						_this.fontSizeInput.val(_this.properties.get('fontSize'));
					}
				});
			}).val(this.properties.get('fontSize'));
			
			this.fontSizeSlider = this.$('#fontSizeSlider').slider({
				min: this.properties.get('minFontSize'),
				max: this.properties.get('maxFontSize'),
				value: this.properties.get('fontSize'),
				slide: function(event, ui){	
					_this.properties.set({fontSize: ui.value}, {
						error: function(){
							_this.fontSizeSlider.val(_this.properties.get('fontSize'));
						}
					}); 
				}
			});
			
			
			/* Attributs de police */
			
			this.$('.fontAttribute').change(function(e){
				_this.properties.set($(this).val(), $(this).is(':checked'));
			});
		},
		
		refreshBrushPreview: function(canvasRatio){
			
			this.brushPreview.fillStyle = this.properties.get('color1');
			
			this.brushPreview.clearRect(0, 0, 100, 100);
			
			this.brushPreview.beginPath();
			this.brushPreview.arc(50, 50, (this.properties.get('lineWidth'))/canvasRatio, Math.PI*2, 0, true);
			
			this.brushPreview.fill();
		},
		
		updateLayout : function(tool){
			var filter = '#colorPalette, #brushSize';
				
			switch(tool.get('id')){
				case 'text':
					filter = '#colorPalette, #fontSize, #fontAttributes';
					break;
				case 'ellipse':
				case 'rect':
					filter = '#colorPalette, #brushSize, #fillSwitch';
					break;
			}
			
			this.items.filter(filter).show();
			this.items.filter(':not('+filter+')').hide();
		}
		
		
	});
});