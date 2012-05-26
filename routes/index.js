
/*
 * GET root.
 * Redirects to the right folder depending on the mode
 */

exports.index = function(req, res){
	res.redirect('/app/');
};

exports.index_d = function(req, res){
	res.redirect('/app-dev/');
};


/*
 * GET app page
 */
exports.app = function(req, res){
	res.render('index', {
		layout: false,
		FB: {
			appId: process.env.FACEBOOK_APP_ID,
			scope: process.env.FACEBOOK_SCOPE
		}
	});
};

/*
 * GET and caches the channel file
 */
exports.channel = function(req, res, next){
	var cache_expire = 60*60*24*365;
	res.header('Pragma', 'public');
	res.header('Cache-Control', 'max-age='+cache_expire);
	res.header('Expires', new Date(Date.now()+cache_expire*1000));
	next();
};