define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.discussions = Backbone.View.extend({
		el: '#discussions',
		
		initialize : function(){
			
			this.label = _.template($('#tp_conferenceLabel').html());
			this.list = this.$('#discussionsList');
			
			app.collections.discussions.bind('started', function(discuss){
				this.list.append(this.label({name: "test"}));
				
			}, this);
		}
	});
});