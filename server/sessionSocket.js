/* 		=== sessionSocket.js ===
	
	sh*t just got serious with socket.io and sessions.
	
	Dependancies :
		requires socketglue.js and the express framework
	
	
	Usage:
	
		initialize the module as soon as possible in your program with glue and session settings :
		
		var io = require('socket.io').listen(express.createServer()),
		glue = require('lib/socketglue.js').listen(io),
		require('lib/sessionSocket.js')(glue, {store: foo, secret: 'bar'});
		
		io.set("transports", ["xhr-polling"]);
		
		io.sockets.on('connection', function (socket) {
			console.log("User connected with session id : "+socket.sessionID());
			
			socket.session().name = 'anonymous';
			socket.session().save();
			
			socket.on('setMyName', function(name){
				socket.session().name = name;
				socket.session().save();
			})
			.on('sayMyName' function(){
				socket.session().reload(function(){
					socket.emit('yourName', "Hello, "+socket.session().name);
				});
			});
		
		});
		
		The advantages of using session is that you share the same session object between different browser tabs, and http requests handled via express.
		it allows you to easily implement server-side authentication mecanisms.

		
	Warning :
	
		sessionSocket.js will only work with xhr-polling transports mode because it needs to access express's session cookie through http requests.
	
	See also :
		socketglue.js
		sessionFacebook.js
*/

//Dependencies
var express = require('express');

module.exports = function(glue, options){
	glue.io.sockets.on('connection', function(socket){
	
		if(socket.manager.transports[socket.id].name != 'xhr-polling'){
			throw 'SessionSocket only works with xhr-polling transport, please use io.set("transports", ["xhr-polling"]);';
		}
		socket.session = function(){
			return socket.manager.transports[socket.id].req.session;
		};
		socket.sessionID = function(){
			return socket.manager.transports[socket.id].req.sessionID;
		};
	});
	
	glue.use(express.cookieParser());
	glue.use(express.session(options));
};