var express = require('express') ;
var http = require('http'); 
var util = require("util");
var auth=require('./auth');
var config = require('./config.js');

var app=express();
app.configure(function () {
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use('/public', express.static(__dirname + '/public'));
	app.use(app.router);	
	app.use(function(err, req, res, next){
		res.send(500, { error: err.message});
	});
});

// ga config api
app.get('/ajax/ga/page', config.find); 
app.get('/ajax/ga/:pageKey', config.load); 
app.post('/ajax/ga/page', config.create); 
app.post('/ajax/ga/page/:pageKey', config.update); 

//auth api
app.post('/ajax/ga/user/login', auth.login); 
app.post('/ajax/ga/user/logout', auth.logout); 

//static pages
app.get('/', auth.checkAuth, function(req,res){
	res.sendfile(__dirname+'/public/index.html');
});
app.get('/login', function(req,res){
	res.sendfile(__dirname+'/public/login.html');
});


var server=http.createServer(app);
server.listen(3000); 
console.log("server listening on port 3000");





