
/* Module "server" assurant la liaison en temps réel entre les clients */

module.exports = function(app, mongoose){

	var io = require('socket.io').listen(app),
		access = require('./accessors.js')(mongoose);

	//Configuration de sockets.io
	io.configure(function () { 
		io.set("transports", ["xhr-polling"]); 
		io.set("polling duration", 10); 
		io.set('log level', 1);  
	});
	
	//Comportement de socket.io
	io.sockets.on('connection', function (socket) {
		socket.on('newAct', (function () {
			var counter = 0;
			
			return function(data){
				data.act.id = counter++;
				
				socket.emit('pushAct', {mod: data.mod, act: data.act});
			}
		})());
	});	
	
	
	//Configuration des méthodes de persistance des discussions
	app.post('/store/model/discussion', access.getDiscussion);
	app.get('/store/collection/discussions', access.getDiscussionCollection);
};