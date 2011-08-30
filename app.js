
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
  var busStopTime = function(bus_time) {
	socket.emit('bus_stop_time', {bus_stop_time: bus_time});
  }
/*
  var busStopLatLongCallback = function(bus_stop_lat_long) {
	socket.emit('bus_stop', {bus_stop: bus_stop_lat_long});
  }
*/

  socket.on('destination_selected', function (data) {
	dbProvider.realStopIdFromServiceAndDirection(data.selected_bus, parseInt(data.selected_dest), function(bus_stops) {
		dbProvider.latLongFromRealStopIds(bus_stops, function(bus_stop_lat_long) {
			socket.emit('bus_stop', {bus_stop: bus_stop_lat_long});
			timeProvider.requestTimeForBusStop(data.selected_bus, bus_stop_lat_long.real_stop_id, function(bus_time) {
				socket.emit('bus_stop_time', {bus_stop_time: bus_time});
				
			});
			/*
			setInterval(function(){ timeProvider.requestTimeForBusStop(data.selected_bus, bus_stop_lat_long.real_stop_id, function(bus_time) {
				socket.emit('bus_stop_time', {bus_stop_time: bus_time});
				
			}); }, 100);
			*/
			console.log(bus_stop_lat_long.real_stop_id);
		});
	});
  });

  socket.on('bus_selected', function(data) {
	var selected_bus = data.bus;
	dbProvider.destinationsForBus(selected_bus, function(destinations_rows) {
		socket.emit('destinations', {destinations: destinations_rows});
	});
  });
});

console.log('socket.io initialised!');









