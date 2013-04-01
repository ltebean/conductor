var mongo = require('mongodb');

var db = new mongo.Db('gaconfig', new mongo.Server('localhost', 27017, {auto_reconnect: true}));
db.open(function(err, db) {
	if(!err) {
		console.log("Connected to  database");
		db.collection('pageConfig', {safe:true}, function(err, collection) {
			if (err) {
                //populateDB();
            }
        });
	}
});

exports.sharedDB=db;