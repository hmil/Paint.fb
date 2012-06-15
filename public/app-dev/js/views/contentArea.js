define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.contentArea = Backbone.View.extend({
		el: '#content_area',
		
		initialize : function(){
			this.tp_friendInfo = _.template($('#content_friendInfo').html());
		},
		
		showFriendInfo : function(friend){
			
			this.$el.empty().append(this.tp_friendInfo(friend));
		
		}
	});
});