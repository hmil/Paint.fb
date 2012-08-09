
/* sessionSocket.js :
	ajoute les propriétés session() et sessionID() aux sockets
	
	à utiliser avec le transport xhr-polling et le middleware session (inséré grace à socketglue.js)
*/
module.exports = function(io){
	io.sockets.on('connection', function(socket){
	
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

};