define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Models.Discussion = Backbone.Model.extend({
		
		defaults: {
			members: new Array(),
			
			canvas: false
		},
		
		initialize: function(){
			this.url = "/store/discuss/";
		}
	
	});

});
