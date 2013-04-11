var mongo = require('mongodb');
var config= require('./config.js').loadConfig();

var db = new mongo.Db(config.db.dbName, new mongo.Server(config.db.address, config.db.port, {auto_reconnect: true}));
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