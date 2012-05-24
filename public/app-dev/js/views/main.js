
define(['app', 'lib/backbone'], function(app){

	app.Views.main = Backbone.View.extend({
		el: '#content',
		login_frame: false,
		main_frame: false,
		
		initialize : function() {			
			//On cache l'écran de chargement maintenant que tous les fichiers sont chargés.
			this.$('#loading_frame').hide();
			
			this.initLogin();
			this.initMainFrame();
		},
		
		
		//Initialise les choses en rapport avec le login
		initLogin : function(){
			var _this = this;
			
			//Mise en place des méthodes de login
			this.$('#login_button').click(function(){
				app.models.facebook.login();
			});
			app.models.facebook.on('login', function(){
				//L'utilisation d'une fonction anonyme permet de préserver la variable this lors de l'appel de showMainFrame()
				_this.showMainFrame();
			});
			
			this.login_frame = this.$('#login_frame');
		},
		
		//Initialise la mainFrame
		initMainFrame: function(){
			var _this = this;
			//Instanciation des vues
			app.views.menu = new app.Views.menu();
			//Sauvegarde un instance de l'objet jquery de la mainframe
			this.main_frame = this.$('#main_frame');
			
			//Redimentionne la drawing_frame quand le menu est redimentionné
			app.views.menu.on('resized', function(width){
				_this.$('#drawing_frame').width($(window).width() - width);
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
			return this;
		}

	});
});