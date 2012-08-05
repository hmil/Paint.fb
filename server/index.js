
/* Module "server" assurant la liaison en temps réel entre les clients */

module.exports = function(app, mongoose, sessionStore, facebook){

	var io = require('socket.io').listen(app),
		models = require('./models')(mongoose),
		access = require('./accessors.js')(mongoose, models);

	//Configuration de sockets.io
	io.configure(function () { 
		io.set("transports", ["xhr-polling"]); 
		io.set("polling duration", 10); 
		io.set('log level', 1);  
	});
	
	var cookieParser = require('express').cookieParser();
	var Session = require('express/node_modules/connect').middleware.session.Session;
	
	io.set('authorization', function (data, accept) {
		//First build a fake request
		var req = {
			headers: data.headers
		};
		
		//Then use it with express' cookieParser middleware
		cookieParser(req, {}, function(){
			// check if there's a cookie header
			if (req.cookies) {
				// note that you will need to use the same key to grad the
				// session id, as you specified in the Express setup.
				data.sessionID = req.cookies['express.sid'];
				data.sessionStore = sessionStore;
				sessionStore.get(data.sessionID, function (err, session) {
					if (err || !session) {
						accept('Error', false);
					} else {
						// create a session object, passing data as request and our
						// just acquired session data
						data.session = new Session(data, session);
						
						accept(null, true);
					}
				});
			} else {
			   // if there isn't, turn down the connection with a message
			   // and leave the function.
			   return accept('No cookie transmitted.', false);
			}
		});
	});

	//Comportement de socket.io
	io.sockets.on('connection', function (socket) {
		
		socket.on('newAct', access.pushAction(socket));
		
		access.on('newAction', function(arg){
			socket.emit('pushAct', arg.action);
		});
	});
	
	
	//Configuration des méthodes de persistance des discussions
	app.post('/store/model/discussion', access.getDiscussion);
	app.get('/store/collection/discussions', access.getDiscussionCollection);
};