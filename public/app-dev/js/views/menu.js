define(['app', 'lib/backbone', 'lib/underscore', 'views/friendsList'], function(app){

	app.Views.menu = Backbone.View.extend({
		el: '#menu',
		
		initialize : function() {
			this.init_resize();
			
			app.views.friendsList = new app.Views.friendsList();
			
			this.init_conferences();
		},
		
		init_resize: function(){
			var menu = this;
			var minWidth = parseInt(this.$el.css('min-width'));
			
			var onMousemove = function(evt){
				//On calcule la nouvelle largeur
				var width = $(window).width() - evt.pageX;
				if(width > minWidth){
					//On l'applique et déclenche un évènement pour permettre aux autres éléments de s'adapter
					menu.$el.width(width);
					menu.trigger('resized', width);
				}
			};
			
			var onMouseup = function(){
				$(window).unbind('mousemove', onMousemove)
				.unbind('mouseup', onMouseup);
			};
			
			this.$('#menu_resize').mousedown(function(){
				$(window).bind('mousemove', onMousemove)
				.bind('mouseup', onMouseup);
				return false;
			});
		},
		
		init_conferences : function(){
			this.$('#conferences');
		
		}

	});
});