
module.exports = function(mongoose){
	var schemas = require('./schemas.js')(mongoose);

	return {
		schemas: schemas,
		
		Discussion: mongoose.model('discussion', schemas.Discussion),
		Action: mongoose.model('action', schemas.Action)
	};
};