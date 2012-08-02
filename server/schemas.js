/* Ce fichier contient les schemas de donnees mongoDB */

module.exports = function(mongoose){

	return {
		Discussion: new mongoose.Schema({
			members: String,
			actions: []
		})
	};
};

