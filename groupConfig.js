var Step = require('step');
var db = require('./db.js').sharedDB;

exports.create=function(req, res){ 
	Step(	
		function getCollection(){
			db.collection('groupConfig', this); 
		},
		function insertData(err,collection){
			collection.insert(req.body, {safe:true}, this)
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result[0]);		
		});	
} 

exports.update=function(req, res){ 
	Step(	
		function getCollection(){
			db.collection('groupConfig', this); 
		},
		function updateData(err,collection){
			if (err) throw err;
			collection.findAndModify(
				{'name':req.params.groupName},[],
				{$set:{'name':req.body.name}},
				{safe:true,new:true},
				this);
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);		
		});	
} 

exports.find=function(req, res){ 
	Step(
		function getCollection(){
			db.collection('groupConfig', this); 
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
			db.collection('groupConfig', this); 
		},
		function findResult(err,collection){
			if (err) throw err;
			collection.findOne({'name':req.params.groupName},this);
		},
		function generateResponse(err, result){
			if (err) throw err;
			if(req.query.callback){
				res.jsonp(result);
			}else{
				res.send(result);
			}
		});
}