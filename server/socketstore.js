/* SocketStore.js
*/

module.exports = new function(){
	
	//Authenticated sockets
	var authSocks = new Array();
	
	//All sockets
	var socks = new Array();
	
	var idPairs = new Array();
	
	function addInArray(sock, arr, key){

		if(!(key in arr)){
			arr[key] = new Array();
		}
		
		arr[key].push(sock);
		
		return arr[key].length -1;
	}
	
	//Retourne le fb_id correspondant au sid
	function sid2fb_id(sid){
		if(sid){
			if(sid in idPairs){
				return idPairs[sid];
			}
			else{
				return;
			}
		}
		
		return ids.sid;
	}
	
	this.add = function(socket){		
		if(socket.sessionID()){
			socket.storeSID = addInArray(socket, socks, socket.sessionID());
		}
		
		if(socket.session().fb_id){
			socket.storeFID = addInArray(socket, authSocks, socket.session().fb_id);
		}
		else{
			var fb_id = sid2fb_id(socket.sessionID());
			
			if(typeof(fb_id) != 'undefined'){
				socket.storeFID = addInArray(socket, authSocks, fb_id);
			}
		}
		
		return;
	};
	
	this.remove = function(socket){
		var sid = socket.sessionID();
		
		delete socks[sid][socket.storeSID];
		
		if(typeof(socket.storeFID) != 'undefined'){
			var fb_id = socket.session().fb_id;
			if(typeof(fb_id) == 'undefined'){

				fb_id = sid2fb_id(sid);
				if(typeof(fb_id) == 'undefined'){
					return;
				}
			}
			
			delete authSocks[fb_id][socket.storeFID];
			
			if(socks[sid].length = 0){
				delete idPairs[sid];
			}
			this.deauth(sid, fb_id);
			
		}
	};
	
	this.getByFbID = function(fid){
		return authSocks[fid];
	};
	
	this.getBySID = function(sid){
		return socks[sid];
	};
	
	this.auth = function(sid, fb_id){
		
		
		var sockets = this.getBySID(sid);
		
		for(var i in sockets){
			sockets[i].storeFID = addInArray(sockets[i], authSocks, fb_id);
		}
		
		idPairs[sid] = fb_id;
		
		return;
	};
	
	this.deauth = function(sid, fb_id){
		
		var sockets = this.getByFbID(fb_id);
		
		for(var i in sockets){
			if(sockets[i].sessionID() == sid){
				delete sockets[i].storeFID;
				delete sockets[i];
			}
		}
		
		delete idPairs[sid];
	};
};