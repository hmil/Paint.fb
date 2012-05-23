define(['app', 'lib/backbone', '//connect.facebook.net/en_US/all.js'], function(app){
	
	app.Models.Facebook = Backbone.Model.extend({
		
		defaults : {
			appId : '133910146726405',						//FB App ID
			channelUrl :'//localhost:5000/channel.html',	//Channel file url	
		},

		initialize : function(bar) {
			//On enferme la variable this pour l'utiliser plus tard dans des callbacks
			var _this = this;
			
			FB.init({
				appId      : this.get('appId'), // App ID
				channelUrl : this.get('channelUrl'), // Channel File
				status     : true, // check login status
				cookie     : true, // enable cookies to allow the server to access the session
				xfbml      : true  // parse XFBML
			});
			
			FB.Event.subscribe('auth.login', function(response) {
				_this.trigger('login');
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
			return this;
		},
		
		getLoginStatus: function(cb){
			FB.getLoginStatus(function(response) {
				cb(response.status);
			});
			return this;
		}
	});

});