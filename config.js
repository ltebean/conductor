var Step = require('step');
var db = require('./db.js').sharedDB;

exports.find=function(req, res){ 
	Step(
		function getCollection(){
			db.collection('pageConfig', this); 
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
			db.collection('pageConfig', this); 
		},
		function findResult(err,collection){
			if (err) throw err;
			collection.findOne({'pageKey':req.params.pageKey},this);
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);
		});
}

exports.create=function(req, res){ 
	Step(	
		function getCollection(){
			db.collection('pageConfig', this); 
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
			db.collection('pageConfig', this); 
		},
		function updateData(err,collection){
			if (err) throw err;
			collection.findAndModify(
				{'pageKey':req.params.pageKey},[],
				{$set:{'url':req.body.url,'config':req.body.config}},
				{safe:true,new:true},
				this);
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);		
		});	
} 

var sample={
	pageKey:'commonShop',
	config: {
		normal: [{
			selector:'div #body',
			trackKey:'dp_test_shop_updateShop_{0}_{channel}_{city}',
			delagator:"body"
		}],
		lazy: [
		]
	}
}