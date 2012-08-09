define(['app', 'lib/backbone', 'lib/underscore', 'models/Discussion'], function(app){

	app.Collections.Discussions = Backbone.Collection.extend({
		
		model: app.Models.Discussion,
		
		url: "/store/collection/discussions",
		
		initialize: function(){
			var _this = this;
			
			app.socket.on('pushAct', function(data){
				var model = _this.get(data.mod);
				
				if(model)
					model.pushAction(data);
				//On cree la discussion
				else{
					_this.startWithId(data.mod);
				}
				
			});
		},
		
		getByFriendId : function(fid){
			return _.find(this.models, function(model){
				var mbrs = model.get('members');
				return ( _.indexOf(mbrs, fid) != -1 && mbrs.length == 2); //Si l'ami est présent et est seul
			});
		},
		
		startWithFriend: function(friend){
			var discuss = this.getByFriendId(friend.uid);
			if(discuss){
				this.trigger('selected', discuss);
				return discuss;
			}
			
			discuss = this.create({members: [friend.uid, app.models.facebook.get('me').uid] });
			this.trigger('started', discuss);
				
			return discuss;
		},
		
		startWithId: function(id){
			var discuss = this.get(id);
			
			if(discuss){
				this.trigger('selected', discuss);
				return discuss;
			}
			
			discuss = this.create({id: id}, {wait: true});
			this.trigger('started', discuss);
				
			return discuss;
		}
	
	});

});