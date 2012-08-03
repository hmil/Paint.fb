/* Ce fichier contient les schemas de donnees mongoDB */

module.exports = function(mongoose){

	var exports = {};
	exports.Action = new mongoose.Schema({
		mod: String,
		tool: String,
		id: Number,
		data: {}
	});
	
	exports.Discussion = new mongoose.Schema({
		members: []
	});
	
	return exports;
};

