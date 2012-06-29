define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.conferences = Backbone.View.extend({
		el: '#conferences',
		
		initialize : function(){
			
			this.label = _.template($('#tp_conferenceLabel').html());
			this.list = this.$('#conferencesList');
			
			app.collections.discussions.bind('started', function(discuss){
				this.list.append(this.label({name: "test"}));
				
			}, this);
		}
	});
});