var mongo = require('mongodb');

var db = new mongo.Db('gaconfig', new mongo.Server('localhost', 27017, {auto_reconnect: true}));

module.exports=db;