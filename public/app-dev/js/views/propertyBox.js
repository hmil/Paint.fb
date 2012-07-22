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
			
			
			this.properties = new app.Models.DrawingProperties();
			
			
			this.properties
				.on('change:lineWidth', function(model, width){
					this.brushSizeInput.val(width);
					this.brushSizeSlider.slider('value', width);
				}, this);
			
			/* Initialisation de la palette de couleurs */
			
			this.palette = new app.Views.ColorPalette({
				el: this.$el.find('#colorPalette')
			})
			.on('colorChanged', function(col){
				this.properties.set({strokeStyle: col});
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
		},
		
		refreshBrushPreview: function(canvasRatio){
			this.brushPreview.fillStyle = this.properties.get('strokeStyle');
			
			this.brushPreview.clearRect(0, 0, 100, 100);
			
			this.brushPreview.beginPath();
			this.brushPreview.arc(50, 50, (this.properties.get('lineWidth'))/canvasRatio, Math.PI*2, 0, true);
			
			this.brushPreview.fill();
		}
		
		
	});
});