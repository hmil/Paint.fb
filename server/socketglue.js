/*		=== socketglue.js ===

	Use the glue to stick middlewares ahead of socket.io 
	like you'd do with express;
	
	middleware execution priority will look like this :
	
	[incomming request] -> glue -> socket.io -> express
	
	setup :
	
	var express = require('express'),
		app = express.createServer(),
		io = require('socket.io').listen(app),
		glue = require('lib/socketglue.js').listen(io);
	
	// Bodyparser will only be called if the incomming request
	// isn't consumed by socket.io (which is what we expect)
	app.use(express.bodyParser());
	
	//But we want to be able to use sessions with our sockets
	glue.use(express.cookieParser());
	glue.use(express.session({store: foo, secret: 'bar'}));
	
	---
	
	See also sessionSocket.js for full socket.io session support
	
*/
	
var glue = module.exports = {
	modules: new Array(),
	listen : function(io){
	
		//Detach and save socket.io's request listeners
		var oldListeners = io.server.listeners('request');
		io.server.removeAllListeners('request');
	
		//continue to socket.io's listeners
		function next(req, res){
			for(var i = 0 ; i < oldListeners.length ; i++){
				oldListeners[i].call(io.server, req, res);
			}
		}
		
		function callModule(req, res, id){
			if(typeof(id) == 'undefined')
				id = 0;
			
			if(glue.modules.length > id){
				glue.modules[id](req, res, function(){
					callModule(req, res, id+1);
				});
			}
			else
				next(req, res);
		}
	
		//Catches requests before they reach socket.io
		io.server.on('request', function (req, res) {
			callModule(req,  res);			
		});
		
		return {
			use:	function(module){
				glue.modules.push(module);
			},
			io: io
		};
	}	
}