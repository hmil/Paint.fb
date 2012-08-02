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
			
			//Démarrage de la connection par socket.io
			this.socket = io.connect(window.location.protocol+'//'+window.location.host);
			
			//Instanciation des modèles
			this.models.facebook = new this.Models.Facebook();
			this.models.drawing = new this.Models.Drawing();
			
			//Instanciation des collections
			this.collections.discussions = new this.Collections.Discussions();
			
			//instanciation des vues : la vue principale instancie les autres
			this.views.main = new this.Views.main();
			
			//On vérifie que l'utilisateur est connecté
			this.models.facebook.getLoginStatus(function(status){
				//On cache l'écran de chargement maintenant que tous les fichiers sont chargés.
				this.$('#loading_frame').hide();
			
				//Selon le statut, on montre l'écran principal ou l'écran de login
				if(status === 'connected'){
					app.views.main.showMainFrame();
					app.collections.discussions.fetch();
				}
				else
					app.views.main.showLoginFrame();
			});
		}
	};
});