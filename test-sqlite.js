var sys    = require('sys'),
    sqlite = require('./node_modules/sqlite');

var db = new sqlite.Database();

// open the database for reading if file exists
// create new database file if not

db.open("busguides.db", function (error) {
  if (error) {
      console.log("Tonight. You.");
      throw error;
  }
    db.query(
        "SELECT * FROM new_services WHERE service = '2';",
        function (error, row) {
            if (error) { console.log(error) }
            else if(row) {
                console.log(row.real_stop_id);
            }
        }
    );
});

setInterval(function(){ console.log('X'); }, 10000);