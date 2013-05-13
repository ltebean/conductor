
var validUsers=require('./config.js').loadConfig().validUsers;

exports.checkAuth=function(req,res,next){
	if (!req.cookies.uid) {
		if(req.xhr){
			res.send(403);
			return;
		}else{
			res.redirect('/login');
			return;
		}
	}
	var user=validUsers[req.cookies.uid];
	if(!user){
		if(req.xhr){
			res.send(403);
			return;
		}else{
			res.redirect('/login');
			return;
		}
	}

	if(req.method=='POST'){
		if(user.permission =='r'){
			res.send(403);
			return;
		}
	}
	next();
}

exports.loadUser=function(req,res){
	if (!req.cookies.uid) {
		res.send({});
	} else {
		var user=validUsers[req.cookies.uid];
		if(!user){
			res.send({});
		}else{
			res.send(user);
		}
	}
}

exports.login=function(req,res){
	var user=req.body;
	for (var id in validUsers) {
		if(user.username==validUsers[id].username && user.password==validUsers[id].password){
			res.cookie('uid', validUsers[id].id, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
			res.send(200);
			return;
		}
	};
	res.send({error:'invalid'});	
}

exports.logout=function(req,res){
 	res.clearCookie('uid');
	res.send(200);
}
