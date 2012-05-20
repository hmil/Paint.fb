
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
	res.render('index', {layout: false});
};