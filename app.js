
/**
 * Module dependencies.
 */
var http = require('http');
var fs = require('fs');

fs.readdir('.', function(err, files) {
	if (err) console.log('Error reading directory.');
	console.log(files[1]);
	for (var i= 0; i<files.length; i++) {
		console.log(files[i]);
	}
});

fs.open('./all_service2_stops.txt', 'r', mode=0666, function (err, fd) {
	console.log(fd);
});

fs.readFile('all_service2_stops.txt', function (err, data) {
  if (err) throw err;
  console.log(data);
});


var allBusStopsArray = [];
var i = 0;

fs.readFileSync('all_service2_stops.txt').toString().split('\n').forEach(function (line) { 
		allBusStopsArray[i++] = line;
		console.log(allBusStopsArray[i]);
	});	


for (var reqIndex = 0; reqIndex < i; reqIndex++) {
	var options = {
		host: 'sg-next-bus.appspot.com',   
    	port: 80,   
    	path: '/sgbusesapp/getarrivaltime?svc=2&busstop=' + allBusStopsArray[reqIndex]  
	};
	var receive_time = function(chunk) {
		console.log("Body: " + chunk); 
	}

	var req = http.get(options, function(res) {  
			console.log("Got response: " + res.statusCode);   
    		res.on('data', receive_time);   
 		}).on('error', function(e) {  
			console.log("Got error: " + e.message);   
		});
	
}
