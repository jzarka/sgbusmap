
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
//var _ = require('underscore')._,
//    backbone = require('backbone');

/**
 * Custom modules.
 */
var DbProvider = require('./db-provider').DbProvider;
var dbProvider = new DbProvider();

var TimeProvider = require('./time-provider').TimeProvider;
var timeProvider = new TimeProvider();

// Configuration

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
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express',
    value: 'VALLL'
  });
});


app.post('/route', function(req, res){
  res.render('index', {
    title: 'Express',
    value: 'VALLL'
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


io.sockets.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
  var busStopTime = function(bus_time) {
	socket.emit('bus_stop_time', {bus_stop_time: bus_time});
  }
/*
  var busStopLatLongCallback = function(bus_stop_lat_long) {
	socket.emit('bus_stop', {bus_stop: bus_stop_lat_long});
  }
*/

  socket.on('destination_selected', function (data) {
	console.log('selected bus' + data.selected_bus);
	console.log('selected dest ' + data.selected_dest);
	dbProvider.findBusStops(data.selected_bus, function(bus_stops) {
		dbProvider.addLatLong(bus_stops, function(bus_stop_lat_long) {
				socket.emit('bus_stop', {bus_stop: bus_stop_lat_long});
		});
	});
//	dbProvider.findBusStopsDestination(data.selected_bus, data.selected_dest);	
  });

  var destinationsFoundForBus = function(destinations_rows) {
	console.log(destinations_rows);
	socket.emit('destinations', {destinations: destinations_rows});
  }

  socket.on('bus_selected', function(data) {
	var busStopFound = function(bus_stops) {
	  console.log(bus_stops);
	}
	var selected_bus = data.bus;
	console.log(selected_bus);
	dbProvider.destinationsForBus(selected_bus, destinationsFoundForBus);
  });

/*
var busStopCallback = function(bus_stops) {
    dbProvider.addLatLong(bus_stops, busStopLatLongCallback);
    timeProvider.requestTime('2', bus_stops, busStopTime);
  }
  dbProvider.findBusStops('2', busStopCallback);
*/
/*
	setInterval(function(){
	console.log('emit news');
 	socket.emit('news', { hello: 'world'});
	}, 1000);
*/
});

console.log('socket.io initialised!');









