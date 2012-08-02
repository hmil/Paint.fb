
//accessors.js

module.exports = exports = function(mongoose){
	var models = require('./models.js')(mongoose);
	
	//Route utilisée lors de la création d'une discussion par le client
	return {
		getDiscussion: function(req, res){	
			
			//On récupère les membres impliqués dans la discussion
			var members = req.body.members;
			
			//Et on cherche une discussion avec les mêmes membres
			models.Discussion.find({'members': members }, function (err, results) {
				if (err) { throw err; }
				
				//Si on n'a rien trouvé
				if(results.length == 0){
					console.log('creating new discuss');
					
					//On crée une nouvelle discussion avec ces membres
					var discuss = new models.Discussion({members: members});
					
					discuss.save(function (err) {
						if (err) { throw err; }
						console.log("Discussion crée avec l'id : "+discuss._id);
						
						res.send('{"id": "'+discuss._id+'"}');
					});
				}
				else{
					
					
					//On crée une variable temporaire
					var discuss = results[0];
					
					console.log('sending existng discuss with id : '+discuss.id);
					
					res.send('{"id": "'+discuss._id+'",'
							+ '"actions": '+JSON.stringify(discuss.actions)+'}');
				}
			});
		},
		

		//Route restituant la collection de discussion pour l'utilisateur en cours
		getDiscussionCollection: function(req, res, next){
			next();
		}
	};
};

