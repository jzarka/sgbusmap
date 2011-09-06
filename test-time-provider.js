

var TimeProvider = require('./time-provider').TimeProvider;
var timeProvider = new TimeProvider();

timeProvider.requestTimeForBusStop('2', '99021', function(bus_time) {
	console.log(bus_time);
});