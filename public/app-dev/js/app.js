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
		},
		
		login: function(){
			this.models.facebook.login(function(success){
				if(success == true){
					console.log('logged in');
				}
				else{
					console.log('not logged in');
				}			
			});
		}
	};
});