
/**
 * Module dependencies.
 */

var express = require('express'),
	app = module.exports= express.createServer(),
	routes = require('./routes'),
	mongoose = require('mongoose');
	
//configuration de mongoose
mongoose.connect(process.env.MONGO_PATH || "mongodb://localhost/test", function(err) {
  if (err) { throw err; }
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
	app.post('/', routes.index_d);
	
	require('./debug')();
});

app.configure('production', function(){
	app.use(express.errorHandler());
	app.get('/', routes.index);
	app.post('/', routes.index);
});

/* Il faut déclarer le module après avoir initialisé app car sinon 
le bodyParser() ne fera pas effet pour les routes utilisées dans ce module. */
var server = require('./server')(app, mongoose);

app.get('/app-dev', routes.app);
app.get('/app', routes.app);
app.post('/app', routes.app);

//Route spéciale pour mettre en cache le fichier channel
app.get('/channel.html', routes.channel);
	
app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
