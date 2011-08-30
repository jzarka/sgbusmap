var sys    = require('sys'),
    sqlite = require('../node-sqlite/sqlite');

DbProvider = function() {
}


DbProvider.prototype.destinationsForBus = function(service_no, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) {
        console.log("Tonight. You.");
        throw error;
    }
	
	var sql = 'SELECT * FROM directions WHERE bus_number = ?';
	var destinations = [];
	db.prepare(sql, function (error, statement) {
	  if (error) throw error;
	    // Fill in the placeholders
	  console.log(['2']);
	  var service = unescape(service_no);
	  console.log([service_no]);
	  statement.bindArray([unescape(service)], function () {
	    statement.fetchAll(function (error, rows) {

		  callback(rows);
	      statement.finalize(function (error) {
			if (error) throw error;
	      });
		  db.close(function(error) {
			if (error) throw error;
			console.log('closing db for destinationForBus.');
		  });
	    });
	  });
	});
  });
}

DbProvider.prototype.findBusStops = function(service_no, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) {
        console.log("Tonight. You.");
        throw error;
    }

	var sql = 'SELECT * FROM new_services WHERE service = ?';
	var bus_stops = [];
	db.prepare(sql, function (error, statement) {
	  if (error) throw error;
	    // Fill in the placeholders

	  statement.bindArray([service_no], function () {
	    statement.fetchAll(function (error, rows) {
		
		  for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
			bus_stops[rowIndex] = rows[rowIndex]['real_stop_id'];
		  }
		  callback(bus_stops);
	      statement.finalize(function (error) {
			if (error) throw error;
	      });
		  db.close(function(error) {
			if (error) throw error;
			console.log('closing db for findBusStops.');
		  });
	    });
	  });
	});
  });
}

DbProvider.prototype.addLatLong = function(bus_stops, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) {
        console.log("Tonight. You.");
        throw error;
    }

	var sql = 'SELECT * FROM new_stops WHERE real_stop_id = ?';
	console.log(bus_stops[0] + '.');
	var i = 0;
	
	for (index = 0; index < bus_stops.length; index++) {
	  db.prepare(sql, function (error, statement) {
	    if (error) throw error;
		statement.bindArray([bus_stops[i++]], function () {
          var stop = {};
	      statement.fetchAll(function (error, rows) {
		    if (error) console.log("error getting rows");
		    else if (stop) {

				console.log('stop' + stop + ' rows' + rows);
			    stop.real_stop_id = rows[0].real_stop_id;
			    stop.stop_name = rows[0].stop_name;
			    stop.latitude = rows[0].latitude;
			    stop.longitude = rows[0].longitude;
			    callback(stop);
		    }
		    statement.finalize(function (error) {
		      if (error) console.log('error finalizing statement db in addLatLong' + error);
			  console.log('finalize.');
		    });
	      });
	    });
	  });
    }
	db.close(function(error) {
		if (error) console.log('error closing db in addLatLong.');
	});
  });
}


exports.DbProvider = DbProvider;

