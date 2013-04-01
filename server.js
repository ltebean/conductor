var express = require('express') ;
var http = require('http'); 
var util = require("util");
var config = require('./config.js');

var app=express();
app.configure(function () {
	app.use(express.bodyParser());
	app.use('/public', express.static(__dirname + '/public'));
	app.use(app.router);	
	app.use(function(err, req, res, next){
		res.send(500, { error: err.message});
	});
});

app.get('/page/:pageKey', config.load); 
app.post('/page', config.create); 
app.post('/page/:pageKey', config.update); 

var server=http.createServer(app);
server.listen(3000); 
console.log("server listening on port 3000");





