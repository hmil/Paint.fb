define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Models.Discussion = Backbone.Model.extend({
		
		defaults: {
			members: new Array(),
			
			//Stocke les actions de dessin dans l'ordre chronologique
			actions: new Array()
		},
		
		initialize: function(){
			this.url = "/store/model/discussion";
			
			
			this.actionCur = 0;
			this.get('members').sort(function(a,b){return a-b});
			
			//Lorsque les actions initiales ont été chargées du serveur, on les affiche
			this.on('sync', this.readActions, this);
		},
		
		addMember: function(member){
			var members = this.get('members');
			members.push(member);
			members.sort(function(a,b){return a-b});
		},
		
		/*
			La méthode createAction() doit être appellée pour ajouter une action. 
			Elle intérroge le serveur pour garantir que, dans le cas où les deux utilisateurs envoient une 
			action en même temps, elles soient tout de même classées dans le même ordre chez les deux clients. 
		*/
		createAction: function(action){
			action.mod = this.id;
			app.socket.emit('newAct', action);
		},
		
		/*
			Cette méthode est appellée par la collection qui écoute le serveur et reçoit les actions (créées localement comme à distance sans distinction)
		*/
		pushAction: function(action){
			if(typeof(action.id) == 'undefined')
				throw "method pushAction() requires action.id, use createAction() instead";
				
			this.get('actions')[action.id] = action;
			
			this.readActions();
		},
		
		readActions: function(){
			//tant qu'il y a des actions à executer
			while(this.get('actions')[this.actionCur]){
				
				//On execute l'action avec l'outil approprié
				var action = this.get('actions')[this.actionCur];
				app.models.drawing.get('tools').get(action.tool).drawAction(action.data, this.canvas.get()[0].getContext('2d'));
				
				//Et on passe à la suivante.
				this.actionCur++;
			}
		}
	
	});

});
