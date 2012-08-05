/* Facebook.js parse la requète pour vérifier si l'utilisateur est connecté via facebook */

var querystring = require("querystring");

var base64ToString = function(str) {
	return (new Buffer(str || "", "base64")).toString("ascii");
};

var base64UrlToString = function(str) {
	return base64ToString( base64UrlToBase64(str) );
};

var base64UrlToBase64 = function(str) {
	var paddingNeeded = (4- (str.length%4));
	for (var i = 0; i < paddingNeeded; i++) {
		str = str + '=';
	}
	return str.replace(/\-/g, '+').replace(/_/g, '/')
};

module.exports = new function(){
	
	this.app_id = '';
	this.secret = '';
	this.scope = '';
	
	var facebook = this;
	
	//Fonction qui parse la requête
	this.middleware = function(req, res, next){
		
		var namespace = req.facebook = {
			authenticated: false, // Tells wether user is authenticated or not
			errinfo: 'none' // Contains error info (when authenticated == false)
		};
		
		function abortAuth(message){
			namespace.errinfo = message;
			
			if(req.session){
				//Deletes userid in the session in case user disconnected
				if(req.session.fb_id){
					req.session.fb_id = '';
					req.session.save();
				}
			}
			
			next();
		}
		
		function acceptAuth(user_id){
			namespace.authenticated = true;
			namespace.user_id = data.user_id;
			
			if(req.session){
				//Deletes userid in the session in case user disconnected
				if(!req.session.fb_id){
					req.session.fb_id = user_id;
					req.session.save();
				}
			}
			
			next();
		}
			
		//On vérifie que les coordonnées de l'app sont bien fournies
		if(facebook.app_id == '' || facebook.secret == '')
			return abortAuth('No app_id or secret given. Please use : .configure({ app_id: XXX, secret: XXX (, scope: xxx) })');

		//Nom du cookie contenant la requête signée
		var cookie = 'fbsr_'+facebook.app_id;
		
		var signed_request = req.cookies[cookie];	
		
		if(typeof(signed_request) == 'undefined')
			return abortAuth('No cookie given');
		
		var parts = signed_request.split('.');
		var sig = base64UrlToBase64(parts[0]);
		var payload = parts[1];
		var data = JSON.parse(base64UrlToString(payload));	

		//User is not authorized
		if (!data.user_id) {
			abortAuth('User is not authorized');
		}
		else {
			// lets verify
			if (data.algorithm.toUpperCase() !== 'HMAC-SHA256') 
				return abortAuth('Unknown algorithm. Expected HMAC-SHA256');

			var hmac = require('crypto').createHmac('sha256', facebook.secret);
			hmac.update(payload);
			var expected_sig = hmac.digest('base64');
			
			if (sig != expected_sig){
				abortAuth('wrong signed request (maybe a wrong app secret)');
			}
			else {
				acceptAuth(data.user_id);
			}
		}
	};
	
	this.configure = function(options){
		this.app_id = options.app_id;
		this.secret = options.secret;
		this.scope = options.scope;		
	};
};