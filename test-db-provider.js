var DbProvider = require('./db-provider').DbProvider;
var dbProvider = new DbProvider();


// console.log('');

dbProvider.findBusStops('2', function(data) {
//	console.log(data);
});


dbProvider.destinationsForBus('2', function(data) {
//	console.log(data);
});

var test = '\'2\'';
console.log(test);
console.log(escape(test));

// setInterval(function(){ console.log('X'); }, 10000);