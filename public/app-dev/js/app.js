define(function(){

	return window.app = {	
		// Classes
		Collections: {},
		Models: {},
		Views: {},
		// Instances
		collections: {},
		models: {},
		views: {},
		init: function () {
			// Initialisation de l'application ici
			console.log('app init');
			
			//On instancie le modèle facebook
			this.models.facebook = new this.Models.Facebook();
			this.views.main = new this.Views.main();
			
			//On vérifie que l'utilisateur est connecté
			this.models.facebook.getLoginStatus(function(status){
				//Selon le statut, on montre l'écran principal ou l'écran de login
				if(status === 'connected')
					app.views.main.showMainFrame();
				else
					app.views.main.showLoginFrame();
			})
			.on('login', function(){
				//L'utilisation d'une fonction anonyme permet de préserver la variable this lors de l'appel de showMainFrame()
				app.views.main.showMainFrame();
			});
		}
	};
});