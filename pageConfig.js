var Step = require('step');
var db = require('./db.js').sharedDB;

exports.find=function(req, res){ 
	Step(
		function getCollection(){
			db.collection('pageConfig', this); 
		},
		function findResult(err,collection){
			if (err) throw err;
			collection.find({'groupName':req.params.groupName}).toArray(this);;
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
			if(req.query.callback){
				res.jsonp(result);
			}else{
				res.send(result);
			}
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

exports.updateUrl=function(req, res){ 
	Step(	
		function getCollection(){
			db.collection('pageConfig', this); 
		},
		function updateData(err,collection){
			if (err) throw err;
			collection.findAndModify(
				{'pageKey':req.params.pageKey},[],
				{$set:{'url':req.body.url}},
				{safe:true,new:true},
				this);
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);
			return "ok";		
		},
		function clearCache(err,status){
 			if(err) throw err;
 			var options={
 				host:'localhost',
 				port:'80',
 				path:'/api/page/'+req.params.pageKey,
 				method:'PURGE'
 			}
 			var request = require('http').request(options,function(response){
			    //console.log("Connected");
			    response.on('data',function(data){
			        //console.log(data.toString());
			    });
			});
			request.end();
		});	
} 

exports.updateConfig=function(req, res){ 
	Step(	
		function getCollection(){
			db.collection('pageConfig', this); 
		},
		function updateData(err,collection){
			if (err) throw err;
			collection.findAndModify(
				{'pageKey':req.params.pageKey},[],
				{$set:{'config':req.body.config}},
				{safe:true,new:true},
				this);
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);
			return "ok";		
		},
		function clearCache(err,status){
 			if(err) throw err;
 			var options={
 				host:'localhost',
 				port:'80',
 				path:'/api/page/'+req.params.pageKey,
 				method:'PURGE'
 			}
 			var request = require('http').request(options,function(response){
			    //console.log("Connected");
			    response.on('data',function(data){
			        //console.log(data.toString());
			    });
			});
			request.end();
		});	
} 