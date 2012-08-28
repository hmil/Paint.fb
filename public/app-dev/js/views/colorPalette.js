define([
	'app', 
	'lib/backbone', 
	'lib/underscore',
], function(app){

	app.Views.ColorPalette = Backbone.View.extend({
	
		initialize : function(){
			
			var _this = this;
			
			function switchColors(){
				var col1 = currentColor1.css('background-color');
				var col2 = currentColor2.css('background-color');
				
				currentColor1.css('background-color', col2);
				_this.trigger('color1Changed', col2);
				
				currentColor2.css('background-color', col1);
				_this.trigger('color2Changed', col1);
			}
			
			var currentColor1 = this.$el.find('.currentColor.primary').css('background-color', 'black').click(switchColors);
			var currentColor2 = this.$el.find('.currentColor.secondary').css('background-color', 'white').click(switchColors);
			
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
			.mousedown(function(e){
				
				e.preventDefault();
				
				var color = $(this).css('background-color');
					
				if(e.button == 0){
					currentColor1.css('background-color', color);
					_this.trigger('color1Changed', color);
				}
				else if(e.button == 2){
					currentColor2.css('background-color', color);
					_this.trigger('color2Changed', color);
				}
			})
			.bind('contextmenu', function(){
				return false;
			});
			
		},
	});
});