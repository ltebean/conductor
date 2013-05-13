var Step = require('step');
var db = require('./db.js').sharedDB;

exports.find=function(req, res){ 
	Step(
		function getCollection(){
			db.collection('callbackConfig', this); 
		},
		function findResult(err,collection){
			if (err) throw err;
			collection.find({}).toArray(this);;
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);
		});
}

exports.load=function(req, res){ 
	Step(
		function getCollection(){
			db.collection('callbackConfig', this); 
		},
		function findResult(err,collection){
			if (err) throw err;
			collection.findOne({'name':req.params.name},this);
		},
		function generateResponse(err, result){
			res.send(result);
		});
}

exports.create=function(req, res){ 
	Step(	
		function getCollection(){
			db.collection('callbackConfig', this); 
		},
		function insertData(err,collection){
			collection.insert(req.body, {safe:true}, this)
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result[0]);		
		});	
} 

exports.delete=function(req, res){ 
	Step(
		function getCollection(){
			db.collection('callbackConfig', this); 
		},
		function deleteData(err,collection){
			if (err) throw err;
			collection.remove(
				{'name':req.params.name},
				{safe:true},
				this);
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(200);		
		});	
} 