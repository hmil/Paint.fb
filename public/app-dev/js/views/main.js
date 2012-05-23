
define(['app', 'lib/backbone'], function(app){

	app.Views.main = Backbone.View.extend({
		el: '#content',
		login_frame: false,
		
		initialize : function() {
			//On cache l'écran de chargement maintenant que tous les fichiers sont chargés.
			this.$('#loading_frame').hide();
			
			this.$('#login_button').click(function(){
				app.models.facebook.login();
			});
			
			this.login_frame = this.$('#login_frame');
		},

		showLoginFrame : function() {
			this.login_frame.show();
			return this;
		},
		
		showMainFrame : function(){
			this.login_frame.hide();
			return this;
		}

	});
});