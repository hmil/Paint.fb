define([
	'app', 
	'lib/backbone', 
	'lib/underscore',
], function(app){

	app.Views.ColorPalette = Backbone.View.extend({
	
		initialize : function(){
			
			var _this = this;
			
			var currentColorEl = this.$el.find('.currentColor').css('background-color', 'black');
			
			//Initialisation des couleurs
			
			var baseColors = [	'#000', '#333', '#f00', '#f09', '#f0f', '#90f', '#00f', '#09f',
								'#fff', '#999', '#f90', '#ff0', '#9f0', '#0f0', '#0f9',  '#0ff'
							];
			
			var i = 0;
			this.$el.find('.colorButton').each(function(){
				if(i < baseColors.length)
					$(this).css('background-color', baseColors[i]);
				i++;
			})
			
			//Lors du click sur un bouton
			.click(function(){
				var color = $(this).css('background-color');
				
				currentColorEl.css('background-color', color);
				_this.trigger('colorChanged', color);
			});
		},
	});
});