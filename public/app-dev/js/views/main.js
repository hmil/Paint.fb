
define(['app', 
		'lib/backbone',
		'views/menu',
		'views/contentArea'], function(app){

	app.Views.main = Backbone.View.extend({
		el: '#content',
		login_frame: false,
		main_frame: false,
		
		initialize : function() {						
			this.initLogin();
			this.initMainFrame();
		},
		
		
		//Initialise les choses en rapport avec le login
		initLogin : function(){
		
			//Mise en place des méthodes de login
			this.$('#login_button').click(function(){
				app.models.facebook.login();
			});
			app.models.facebook.on('login', this.showMainFrame, this);
			
			this.login_frame = this.$('#login_frame');
		},
		
		//Initialise la mainFrame
		initMainFrame: function(){
			//Instanciation des vues
			app.views.menu = new app.Views.menu();
			app.views.contentArea = new app.Views.contentArea();
			
			//Sauvegarde un instance de l'objet jquery de la mainframe
			this.main_frame = this.$('#main_frame');
			
			
			//Redimentionne la content_area quand le menu ou la fenêtre est redimentionné
			app.views.menu.on('resized', function(width){
				app.views.contentArea.$el.width($(window).width() - width);
			});
			$(window).resize(function(){
				app.views.contentArea.$el.width($(window).width() - app.views.menu.$el.width());
			});
		},

		showLoginFrame : function() {
			this.main_frame.hide();
			this.login_frame.show();
			return this;
		},
		
		showMainFrame : function(){
			this.login_frame.hide();
			this.main_frame.show();
			
			//S'assure que les éléments aient la bonne dimention lors de l'affichage
			app.views.menu.trigger('resized', app.views.menu.$el.width());
			
			return this;
		}

	});
});