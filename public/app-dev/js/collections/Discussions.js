define(['app', 'lib/backbone', 'lib/underscore', 'models/discussion'], function(app){

	app.Collections.Discussions = Backbone.Collection.extend({
		
		model: app.Models.Discussion,
		
		getByFriendId : function(fid){
			return _.find(this.models, function(model){
				var mbrs = model.get('members');
				return ( _.indexOf(mbrs, fid) != -1 && mbrs.length == 2); //Si l'ami est présent et est seul
			});
		},
		
		startWithFriend: function(friendId){
			var discuss = this.getByFriendId(friendId);
			if(!discuss){
				discuss = this.create({members: [friendId, app.models.facebook.get('me')]});
			}
			
			this.trigger('started', discuss);
			
			return discuss;
		}
	
	});

});