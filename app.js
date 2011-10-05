
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
var _ = require('underscore')._,
    backbone = require('backbone');


var BusStopModel = backbone.Model.extend({
	initialize: function(){
		console.log("BusStop initialised!");
	}
});

var BusStopModelManager = backbone.Collection.extend({
	model: BusStopModel
});


var busStopModelManager = new BusStopModelManager();
var numberOfBusStopsWithTime = 0;
/*
busStopModelManager.bind('add', function(model) {
	console.log('bus mode added...');
	
	
})
*/
//console.log(_);
//console.log(backbone);

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

var all_bus_stops = {};
io.sockets.on('connection', function (socket) {
  socket.on('request_time', function(data) {
	for (var i = 0; i < all_bus_stops[data.selected_bus][data.selected_dest].length; i++) {
		var real_stop_id = all_bus_stops[data.selected_bus][data.selected_dest][i].real_stop_id;
		timeProvider.requestTimeForBusStop(data.selected_bus, real_stop_id, function(bus_time) {
			// socket.emit('bus_stop_time', {bus_stop_time: bus_time});

			console.log('setting time...');
			
			busStopModelManager.getByCid(bus_time.real_stop_id).set({time: bus_time.results[0].nextbus.t});
			numberOfBusStopsWithTime++;
			if (numberOfBusStopsWithTime == busStopModelManager.length) {
				console.log("all bus times");
				numberOfBusStopsWithTime = 0;
				socket.emit('busStopModelManagerWithTime', {busModelManager: busStopModelManager});
			}
		});
	}
  });
  socket.on('destination_selected', function (data) {
	dbProvider.realStopIdFromServiceAndDirection(data.selected_bus, parseInt(data.selected_dest), function(bus_stops) {
		var bus_stops_per_destination = {};
		bus_stops_per_destination[data.selected_dest] = bus_stops;
		all_bus_stops[data.selected_bus] = bus_stops_per_destination;
		
		dbProvider.latLongFromRealStopIds(bus_stops, function(bus_stop_lat_long) {
			var busStopModel = new BusStopModel({
				real_stop_id: bus_stop_lat_long.real_stop_id,
				stop_name: bus_stop_lat_long.stop_name,
				latitude: bus_stop_lat_long.latitude,
				longitude: bus_stop_lat_long.longitude
			});
			busStopModel.cid = bus_stop_lat_long.real_stop_id;
		/*
			busStopModel.bind("change", function() {
				numberOfBusStopsWithTime++;
				console.log("bus " + numberOfBusStopsWithTime + ", "+ busStopModelManager.length);
				if (numberOfBusStopsWithTime == busStopModelManager.length) {
					console.log("all bus times");
					numberOfBusStopsWithTime = 0;
					socket.emit('busStopModelManagerWithTime', {busModelManager: busStopModelManager});
				}
			});
			*/
			busStopModelManager.add(busStopModel);
			socket.emit('bus_stop', {bus_stop: bus_stop_lat_long});
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









