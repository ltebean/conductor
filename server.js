var express = require('express') ;
var http = require('http'); 
var util = require("util");
var auth=require('./auth');
var pageConfig = require('./pageConfig.js');
var groupConfig = require('./groupConfig.js');

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
app.get('/api/page/:pageKey', pageConfig.load); 

// ga config api for admin
app.post('/api/page',auth.checkAuth, pageConfig.create); 
app.post('/api/page/:pageKey/url',auth.checkAuth, pageConfig.updateUrl); 
app.post('/api/page/:pageKey/config',auth.checkAuth, pageConfig.updateConfig); 


// group config api for admin
app.get('/api/group/:groupName', auth.checkAuth, groupConfig.load); 
app.get('/api/group',auth.checkAuth, groupConfig.find); 
app.post('/api/group',auth.checkAuth, groupConfig.create); 
app.post('/api/group/:groupName',auth.checkAuth, groupConfig.update); 
app.get('/api/group/:groupName/page',auth.checkAuth, pageConfig.find); 

//auth api
app.post('/api/user/login', auth.login); 
app.post('/api/user/logout', auth.logout); 

//static pages
app.get('/', auth.checkAuth, function(req,res){
	res.sendfile(__dirname+'/public/index.html');
});
app.get('/login', function(req,res){
	res.sendfile(__dirname+'/public/login.html');
});
app.get('/edit/:id',function(req,res){
    res.sendfile(__dirname+'/public/edit.html'); 
});

//proxy
app.get('/proxy',require('./proxy'));

var server=http.createServer(app);
var port = 8080;
server.listen(port); 
console.log("server listening on port "+port);
