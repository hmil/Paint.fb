//socketglue.js

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
			}
		};
	}	
}