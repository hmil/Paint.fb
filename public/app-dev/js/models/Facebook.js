define(['app', 'lib/backbone', '//connect.facebook.net/en_US/all.js'], function(app){
	
	app.Models.Facebook = Backbone.Model.extend({
		
		defaults : {
			appId : '353159551406479',						//FB App ID
			channelUrl :'//localhost:5000/channel.html',	//Channel file url	
		},

		initialize : function(bar) {
			console.log(this.get('appId'));
			console.log('Facebook model constructor');
			FB.init({
				appId      : this.get('appId'), // App ID
				channelUrl : this.get('channelUrl'), // Channel File
				status     : true, // check login status
				cookie     : true, // enable cookies to allow the server to access the session
				xfbml      : true  // parse XFBML
			});
		},
		
		login: function(cb){
			FB.login(function(response) {
				if (response.authResponse) {
					cb(true);
				} else {
					cb(false);
				}
			});
		
		}
	});

});