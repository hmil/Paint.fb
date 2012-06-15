define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Models.Discussion = Backbone.Model.extend({
		
		defaults: {
			members: new Array()
		},
		
		initialize: function(){
			this.url = "/store/discuss/";
		}
	
	});

});
