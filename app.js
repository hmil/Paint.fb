
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration

//Configuration de sockets.io
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

//Configuration du webserver

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.get('/', routes.index_d);
  app.post('/', routes.index_d)
});

app.configure('production', function(){
  app.use(express.errorHandler());
  app.get('/', routes.index);
  app.post('/', routes.index)
});

app.get('/app-dev', routes.app);
app.get('/app', routes.app);
app.post('/app', routes.app);

//ROUTE TEMPORAIRE POUR LES TESTS COTE CLIENT
app.post('/store/discuss', (function(){
		var counter = 0;
		
		return function(req, res, next){
			if(req.body.id)
				res.send('{"id": "'+req.body.id+'"}');
			else
				res.send('{"id": "'+ (counter++) +'"}');
		};
	})()
);

//Route spéciale pour mettre en cache le fichier channel
app.get('/channel.html', routes.channel);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


io.sockets.on('connection', function (socket) {
	socket.on('newAct', (function () {
		var counter = 0;
		
		return function(data){
			data.act.id = counter++;
			
			socket.emit('pushAct', {mod: data.mod, act: data.act});
		}
	})());
});
