define(['app', 'lib/backbone', 'lib/underscore', 'models/Discussion'], function(app){

	app.Collections.Discussions = Backbone.Collection.extend({
		
		model: app.Models.Discussion,
		
		getByFriendId : function(fid){
			return _.find(this.models, function(model){
				var mbrs = model.get('members');
				return ( _.indexOf(_.pluck(mbrs, 'uid'), fid) != -1 && mbrs.length == 2); //Si l'ami est présent et est seul
			});
		},
		
		startWithFriend: function(friend){
			var discuss = this.getByFriendId(friend.uid);
			if(discuss){
				this.trigger('selected', discuss);
				return discuss;
			}
			
			discuss = this.create({members: [friend, app.models.facebook.get('me')]});
			this.trigger('started', discuss);
				
			return discuss;
		}
	
	});

});