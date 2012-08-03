
/* Module "server" assurant la liaison en temps réel entre les clients */

module.exports = function(app, mongoose){

	var io = require('socket.io').listen(app),
		models = require('./models')(mongoose),
		access = require('./accessors.js')(mongoose, models);

	//Configuration de sockets.io
	io.configure(function () { 
		io.set("transports", ["xhr-polling"]); 
		io.set("polling duration", 10); 
		io.set('log level', 1);  
	});

	//Comportement de socket.io
	io.sockets.on('connection', function (socket) {
		socket.on('newAct', access.pushAction(socket));
		
		//SOLUTION TEMPORAIRE
		access.on('newAction', function(action){
			socket.emit('pushAct', action);
		});
	});
	
	access.on('newAction', function(action){
		models.Discussion.findById(action.mod, function (err, discuss) {
			for(var i = 0 ; i < discuss.members.length ; i++){
				//TODO : envoyer l'action aux clients concernés
			}
		});
	});
	
	
	//Configuration des méthodes de persistance des discussions
	app.post('/store/model/discussion', access.getDiscussion);
	app.get('/store/collection/discussions', access.getDiscussionCollection);
};