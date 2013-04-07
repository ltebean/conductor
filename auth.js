
var validUser={
	id:'1',
	username:'admin',
	password:'admin'
};

exports.checkAuth=function(req,res,next){
	if (!req.cookies.uid) {
		res.redirect('/login');
	} else {
		next();
	}
}

exports.login=function(req,res){
	var user=req.body;
	if(user.username==validUser.username && user.password==validUser.password){
		res.cookie('uid', validUser.id, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
		res.send(200);
	}else{
		res.send({error:'invalid'})
	}
}

exports.logout=function(req,res){
 	res.clearCookie('uid');
	res.send(200);
}
