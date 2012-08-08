//SessionSocket.js

var express = require('express'),
	cookieParser = express.cookieParser();


			

module.exports = function(options){
	var io = options.socket,
		
		session = express.session({
			store: options.store,
			secret: options.secret,
			key: options.key,
			cookie: options.cookie}),
			
		cookie = options.cookie,
		store = options.store;
		
	var oldListeners = io.server.listeners('request');
	io.server.removeAllListeners('request');
	
	io.sockets.on('connection', function(socket){
	
		if(socket.manager.transports[socket.id].name != 'xhr-polling'){
			throw 'SessionSocket only works with xhr-polling transport, please use io.set("transports", ["xhr-polling"]);';
		}
		socket.session = function(){
			return SessionManager.getSession(this);
		};
		socket.sessionID = function(){
			return SessionManager.getSessionID(this);
		};
	});
	
	//continue to socket.io's internals
	function next(req, res){
		for(var i = 0 ; i < oldListeners.length ; i++){
			oldListeners[i].call(io.server, req, res);
		}
	};
	
	//Catches requests before they reach socket.io
	io.server.on('request', function (req, res) {
	
		cookieParser(req, res, function(){
		
			session(req, res, function(){
				return next(req, res);
			});
			
		});
		
	});
	
	
	var SessionManager = function(){};
	
	SessionManager.getSession = function(socket){
		return socket.manager.transports[socket.id].req.session;
	};
	
	SessionManager.getSessionID = function(socket){
		return socket.manager.transports[socket.id].req.sessionID;
	};
	
	return SessionManager;
	
}