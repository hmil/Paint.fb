
/*
 * GET home page.
 * Redirects to the right folder depending on the mode
 */

exports.index = function(req, res, next){
	res.redirect('/app/');
};

exports.index_d = function(req, res){
	res.redirect('/app-dev/');
};
