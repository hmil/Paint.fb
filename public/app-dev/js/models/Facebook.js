define([
	'app', 
	'lib/backbone',
	'lib/underscore'
	//*
	, '//connect.facebook.net/en_US/all.js'
	//*/
	], function(app){
	
	app.Models.Facebook = Backbone.Model.extend({
		
		defaults : {
			appId : FB_APP_ID,			//FB App ID défini par le moteur de templates dans la vue principale
			channelUrl :'//'+window.location.host+'/channel.html',	//Channel file url	
			friendsList: new Array(),
			me : 0
		},

		initialize : function() {
			//On enferme la variable this pour l'utiliser plus tard dans des callbacks
			var _this = this;
			
			//*
			FB.init({
				appId      : this.get('appId'), // App ID
				channelUrl : this.get('channelUrl'), // Channel File
				status     : true, // check login status
				cookie     : true, // enable cookies to allow the server to access the session
				xfbml      : true  // parse XFBML
			});
			
			FB.Event.subscribe('auth.statusChange', function(response) {
				if (response.authResponse) {
					//L'utilisateur est connecté 
					
					//On cherche ses renseignements
					FB.Data.query("SELECT uid, name FROM user WHERE uid = me()")
					.wait(function(me) {
						_this.set('me', me[0]);
					});
	
					_this.trigger('login');
					
				} else {
					_this.trigger('logout');
				}
			});
			//*/
			
			/* OFFLINE MODE
			window.setTimeout(function(){
				_this.set('me', {name: "MILANO", uid: "00123456789"});
				_this.trigger('login');
			}, 1000);
			//*/
		},
		
		login: function(cb){
			FB.login(
				function(response) {
					if (response.authResponse) {
						if($.isFunction(cb))
							cb(true);
					} else {
						if($.isFunction(cb))
							cb(false);
					}
				},
				{
					scope: FB_SCOPE
				}
			);
			return this;
		},
		
		getLoginStatus: function(cb){
			//*
			FB.getLoginStatus(function(response) {
				cb(response.status);
			});
			//*/
			
			
			/* OFFLINE MODE
				cb('connected');
			//*/
			return this;
		},
		
		refreshFriendsList: function(cb){	
			var _this = this;
			
			//*
			FB.Data.query("SELECT uid, name, pic_square, online_presence FROM user WHERE uid IN ( SELECT uid2 FROM friend WHERE uid1 = me()) ORDER BY name")
			.wait(function(response) {
				_this.set('friendsList', response);
				_this.trigger('friendsListRefreshed', _this.get('friendsList'));
				if($.isFunction(cb))
					cb(_this.get('friendsList'));
			});
			//*/
			
			/* OFFLINE MODE
			
			this.set('friendsList', [
					{uid: "0987654321", name: "John smith", online_presence: "active"},
					{uid: "06785865674321", name: "Johana smithers", online_presence: "offline"},
					{uid: "098765432143322", name: "Mike O'riley", online_presence: "idle"},
					{uid: "243578986875", name: "Anthon Billy", online_presence: "null"},
				]);
			if($.isFunction(cb))
				cb(this.get('friendsList'));
				
			this.trigger('friendsListRefreshed', _this.get('friendsList'));
			// END OFFLINE MODE */
		},
		
		getFriend: function(id){
			return _.find(this.get('friendsList'), function(e){
				return (e.uid == id);
			});
		}
	});

});