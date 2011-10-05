var sys    = require('sys'),
    sqlite = require('../node-sqlite/sqlite');

DbProvider = function() {
}





DbProvider.prototype.realStopIdFromServiceAndDirection = function(service_no, direction, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) throw error;
	
	var sql = 'SELECT bus_stops.real_stop_id FROM  fare_stage, bus_stops, new_services WHERE fare_stage.direction = ? and fare_stage.bus_number = ? and bus_stops.stop_id = fare_stage.stop_id and bus_stops.real_stop_id = new_services.real_stop_id and new_services.service = ?';
	var destinations = [];
	db.prepare(sql, function (error, statement) {
	  if (error) throw error;
	    // Fill in the placeholders
	  statement.bindArray([direction, service_no, service_no], function () {
	    statement.fetchAll(function (error, rows) {

		  callback(rows);
	      statement.finalize(function (error) {
			if (error) throw error;
	      });
		  db.close(function(error) {
			if (error) throw error;
		  });
	    });
	  });
	});
  });
}

DbProvider.prototype.latLongFromRealStopIds = function(bus_stops, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) throw error;

	var sql = 'SELECT * FROM new_stops WHERE real_stop_id = ?';
	var i = 0;
	for (var index = 0; index < bus_stops.length; index++) {

	  db.prepare(sql, function (error, statement) {
	    if (error) throw error;
		statement.bindArray([bus_stops[i++]['real_stop_id']], function () {
          var stop = {};
	      statement.fetchAll(function (error, rows) {

		    if (error) throw error;
			stop.real_stop_id = rows[0].real_stop_id;
			stop.stop_name = rows[0].stop_name;
			stop.latitude = rows[0].latitude;
			stop.longitude = rows[0].longitude;
			callback(stop);
			statement.finalize(function (error) {
		      if (error) throw error;
		    });
	      });
	    });
	  });
    }
  });
  db.close(function(error) {
    if (error) throw error;
  });
}


DbProvider.prototype.latLongFromRealStopId = function(bus_stop, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) throw error;

	var sql = 'SELECT * FROM new_stops WHERE real_stop_id = ?';
	var i = 0;
	  db.prepare(sql, function (error, statement) {
	    if (error) throw error;
	    console.log('bus_stop' + bus_stop.real_stop_id);
		statement.bindArray([bus_stop.real_stop_id], function () {
          var stop = {};
	      statement.fetchAll(function (error, rows) {

		    if (error) throw error;
			stop.real_stop_id = rows[0].real_stop_id;
			stop.stop_name = rows[0].stop_name;
			stop.latitude = rows[0].latitude;
			stop.longitude = rows[0].longitude;
			callback(stop);
			statement.finalize(function (error) {
		      if (error) throw error;
//		  	db.close(function(error) {
//		    		if (error) throw error;
//		  		});
		    });

	      });
	    });
	  });
  });

}





DbProvider.prototype.busStopsForDirection = function(service_no, direction, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) throw error;
	
	var sql = 'SELECT * FROM fare_stage WHERE bus_number = ? AND direction = ?';
	var destinations = [];
	db.prepare(sql, function (error, statement) {
	  if (error) throw error;
	    // Fill in the placeholders
	  statement.bindArray([service_no, direction], function () {
	    statement.fetchAll(function (error, rows) {

		  callback(rows);
	      statement.finalize(function (error) {
			if (error) throw error;
	      });
		  db.close(function(error) {
			if (error) throw error;
		  });
	    });
	  });
	});
  });
}


DbProvider.prototype.busStopsForfromStopId = function(bus_stop_id, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) throw error;
	
	var sql = 'SELECT * FROM fare_stage WHERE bus_number = ? AND direction = ?';
	var destinations = [];
	db.prepare(sql, function (error, statement) {
	  if (error) throw error;
	    // Fill in the placeholders
	  statement.bindArray([service_no, direction], function () {
	    statement.fetchAll(function (error, rows) {

		  callback(rows);
	      statement.finalize(function (error) {
			if (error) throw error;
	      });
		  db.close(function(error) {
			if (error) throw error;
		  });
	    });
	  });
	});
  });
}

// callback to be called with:
// [ { bus_number: '518', direction: 0, start_stop_name: 'PASIR RIS INT', start_road_name: 'PASIR RIS DR 3', end_stop_name: 'PASIR RIS INT',end_road_name: 'PASIR RIS DR 3' } ]
DbProvider.prototype.destinationsForBus = function(service_no, callback) {
  var db = new sqlite.Database();
  db.open("./busguides.db", function (error) {
    if (error) throw error;
	
	var sql = 'SELECT * FROM directions WHERE bus_number = ?';
	var destinations = [];
	db.prepare(sql, function (error, statement) {
	  if (error) throw error;
	    // Fill in the placeholders
	  statement.bindArray([service_no], function () {
	    statement.fetchAll(function (error, rows) {

		  callback(rows);
	      statement.finalize(function (error) {
			if (error) throw error;
	      });
		  db.close(function(error) {
			if (error) throw error;
//			console.log('closing db for destinationForBus.');
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
//			console.log('closing db for findBusStops.');
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
		      if (error) {
				console.log('error finalizing statement db in addLatLong' + error);
				throw error;
			  }
		    });
	      });
	    });
	  });
    }
	db.close(function(error) {
		if (error) throw error;
	});
  });
}

// callback to be called with:
// { bus_number: '48', company_id: 0, service_type: 'na' }
DbProvider.prototype.findAllBuses = function(callback) {
  var db = new sqlite.Database();
	db.open("./busguides.db", function (error) {
		db.query("SELECT * FROM buses", function (error, rows) {
  			if (error) throw error;

			if (rows) callback(rows);
		});
	});
	db.close(function(error) {
		if (error) throw error;
	});
}





exports.DbProvider = DbProvider;

