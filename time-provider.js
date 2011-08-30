
/**
 * Module dependencies.
 */
var http = require('http');
var fs = require('fs');
var sys    = require('sys');

TimeProvider = function() {
}

requestTimeForBusStop = function(service_no, bus_stop_no, callback) {
	var options = {
		host: 'sg-next-bus.appspot.com',   
    	port: 80,   
    	path: '/sgbusesapp/getarrivaltime?svc=' + service_no + '&busstop=' + bus_stop_no
	};
	var receive_time = function(chunk) {
		var time = chunk.toString('utf8', 0, chunk.length); 
		var jsonTime = JSON.parse(time);
		jsonTime.real_stop_id = bus_stop_no;
		callback(jsonTime);
	}

	var req = http.get(options, function(res) {  
    		res.on('data', receive_time);   
 		}).on('error', function(e) {  
			console.log("Got error: " + e.message);   
		});
}


TimeProvider.prototype.requestTime = function(service_no, bus_stops, callback) {
	for (var reqIndex = 0; reqIndex < bus_stops.length; reqIndex++) {
		requestTimeForBusStop(service_no, bus_stops[reqIndex], callback);
	}
}

exports.TimeProvider = TimeProvider;