
var validUsers={
	'1':{
			id:'1',
			username:'admin',
			password:'admin',
			permission:'r/w'
		},
	'2':{
			id:'2',
			username:'guest',
			password:'guest',
			permission:'r'
		}
};

exports.checkAuth=function(req,res,next){
	if (!req.cookies.uid) {
		if(req.xhr){
			res.send(403);
		}else{
			res.redirect('/login');
		}
	}
	var user=validUsers[req.cookies.uid];
	if(!user){
		if(req.xhr){
			res.send(403);
		}else{
			res.redirect('/login');
		}
	}

	if(req.method=='POST'){
		if(user.permission!='r/w'){
			res.send(403);
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
