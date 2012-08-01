define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Models.Discussion = Backbone.Model.extend({
		
		defaults: {
			members: new Array(),
			
			//Stocke les actions de dessin dans l'ordre chronologique
			actions: new Array(),
			
			canvas: false
		},
		
		initialize: function(){
			this.url = "/store/discuss/";
			
			
			this.actionCur = 0;
		},
		
		/*
			La méthode createAction() doit être appellée pour ajouter une action. 
			Elle intérroge le serveur pour garantir que, dans le cas où les deux utilisateurs envoient une 
			action en même temps, elles soient tout de même classées dans le même ordre chez les deux clients. 
		*/
		createAction: function(action){
			app.socket.emit('newAct', {mod: this.get('id'), act: action});
		},
		
		/*
			Cette méthode est appellée par la collection qui écoute le serveur et reçoit les actions (crées localement comme à distance sans distinction)
		*/
		pushAction: function(action){
			if(typeof(action.id) == 'undefined')
				throw "method pushAction() requires action.id, use createAction() instead";
				
			this.get('actions')[action.id] = action;
			
			this.readActions();
		},
		
		readActions: function(){
			while(this.get('actions')[this.actionCur]){
				
				//TODO : restituer l'action
				console.log(this.get('actions')[this.actionCur]);
				
				this.actionCur++;
			}
		}
		
	
	});

});
