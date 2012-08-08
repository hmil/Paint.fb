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
	
	//Retourne le sid correspondant au fb_id
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
		
		console.log("Ajout d'une socket : ");
		
		if(socket.sessionID()){
			socket.storeSID = addInArray(socket, socks, socket.sessionID());
		}
		
		if(socket.session().fb_id){
			console.log(" FB_ID fourni : "+socket.session().fb_id);
			socket.storeFID = addInArray(socket, authSocks, socket.session().fb_id);
		}
		else{
			console.log(" FB_ID non fourni");
			var fb_id = sid2fb_id(socket.sessionID());
			
			if(typeof(fb_id) != 'undefined'){
				console.log("  Authentification grace à la mémoire : "+fb_id);
				socket.storeFID = addInArray(socket, authSocks, fb_id);
			}
		}
		
		return;
	};
	
	this.remove = function(socket){
		console.log("Suppression d'une socket");
		delete socks[socket.sessionID()][socket.storeSID];
		
		if(typeof(socket.storeFID) != 'undefined')
			delete authSocks[socket.session().fb_id][socket.storeFID];
	};
	
	this.getByFbID = function(fid){
		return authSocks[fid];
	};
	
	this.getBySID = function(sid){
		return socks[sid];
	};
	
	this.auth = function(sid, fb_id){
	
		console.log("Authenticating :");
		
		var sockets = this.getBySID(sid);
		
		if(typeof(sockets) != 'undefined'){
			for(var i = 0 ; i < sockets.length ; i++){
				sockets[i].storeFID = addInArray(sockets[i], authSocks, fb_id);
			}
		}
		
		idPairs[sid] = fb_id;
		
		return;
	};
	
	this.deauth = function(sid, fb_id){
		console.log("Deauthenticating");
		var sockets = this.getByFbID(fb_id);
		
		for(var i in sockets){
			console.log(" fetching...");
			if(sockets[i].sessionID() == sid){
				console.log("  Deleted");
				delete sockets[i].storeFID;
				delete sockets[i];
			}
		}
		
		delete idPairs[sid];
	};
};