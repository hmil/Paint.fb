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
			
			//instanciation des vues : la vue principale instancie les autres
			this.views.main = new this.Views.main();
			
			//On vérifie que l'utilisateur est connecté
			this.models.facebook.getLoginStatus(function(status){
				//Selon le statut, on montre l'écran principal ou l'écran de login
				if(status === 'connected')
					app.views.main.showMainFrame();
				else
					app.views.main.showLoginFrame();
			});
		}
	};
});