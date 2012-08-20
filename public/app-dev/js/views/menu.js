define(['app', 
		'lib/backbone',
		'lib/underscore',
		'views/friendsList',
		'views/discussions'], function(app){

	app.Views.menu = Backbone.View.extend({
		el: '#menu',
		
		initialize : function() {
			this.init_resize();
			
			var discuss = app.views.discussions = new app.Views.discussions()
				.on('resized', this.resize, this);
			
			var friendsList = app.views.friendsList = new app.Views.friendsList()
				.on('resized', this.resize, this)
				.on('selected', discuss.unselect, discuss)
				
			discuss.on('selected', friendsList.unselect, friendsList);
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
		
		resize: function(height){
			app.views.friendsList.resize(height);
		}

	});
});