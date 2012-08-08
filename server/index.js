

/**
 * Module dependencies.
 */

var express = require('express'),
	mongoose = require('mongoose'),
	facebook = require('./facebook.js'),
	sessionStore = new express.session.MemoryStore(),			
	app = require('./webserver.js')(facebook),
	io = require('socket.io').listen(app),
	
	sessionSocket = require('./sessionSocket.js')({
		socket: io,
		store: sessionStore,
		secret: 'bouzibouzi',
		key: 'express.sid'}),
		
	models = require('./models')(mongoose),
	access = require('./accessors.js')(mongoose, models),
	socketStore = require('./socketstore.js');
	
//configuration de mongoose
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/test", function(err) {
  if (err) { throw err; }
});

//Configuration du middleware d'authentification facebook
facebook.configure({
	app_id: process.env.FACEBOOK_APP_ID,
	secret: process.env.FACEBOOK_SECRET,
	scope: process.env.FACEBOOK_SCOPE
});

//Configuration de sockets.io
io.configure(function () { 
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10); 
	io.set('log level', 1);  
});

//Comportement de socket.io
io.sockets.on('connection', function (socket) {

	socketStore.add(socket);
	
	
	socket
		.on('newAct', access.pushAction(socket))
		.on('disconnect', function(){socketStore.remove(socket)});
	
});

access.on('newAction', function(arg){

	//Pour chaque membre de la discussion
	for(var i = 0 ; i < arg.members.length ; i++){
		
		//On cherche la ou les sockets connectées
		var sockets = socketStore.getByFbID(arg.members[i])
		
		//S'il y en a au moins une
		if(sockets){
			for(var i = 0 ; i < sockets.length ; i++){
				sockets[i].emit('pushAct', arg.action);
			}
		}
	}
});

//On écoute tout les login et logout pour mettre à jour les sockets dans le socketStore
facebook.on('login', function(data){
	//On associe la session à la socket
	socketStore.auth(data.sid, data.fb_id);

		

}).on('logout', function(data){
	//On désassocie la session à la socket
	socketStore.deauth(data.sid, data.fb_id);
});


//Configuration des méthodes de persistance des discussions
app.post('/store/model/discussion', access.getDiscussion);
app.get('/store/collection/discussions', access.getDiscussionCollection);	

