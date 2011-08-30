var DbProvider = require('./db-provider').DbProvider;
var dbProvider = new DbProvider();


// console.log('');

dbProvider.findBusStops('2', function(data) {
//	console.log(data);
});


dbProvider.destinationsForBus('2', function(data) {
//	console.log(data);
});

dbProvider.busStopsForDirection('2', 1, function(rows) {
//	console.log(rows);
})


dbProvider.realStopIdFromServiceAndDirection('2', 1, function(real_stop_ids) {
//	console.log(real_stop_ids);
	dbProvider.latLongFromRealStopIds(real_stop_ids, function(bus_stops) {
		console.log(bus_stops);
	})
})

// setInterval(function(){ console.log('X'); }, 10000);