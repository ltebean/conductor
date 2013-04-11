var args = require('optimist').argv;

var development={
	db:{
		adddress:'localhost',
		port:27017,
		dbName:'gaconfig'
	}
};

var product={
	db:{
		address:'localhost',
		port:27017,
		dbName:'gaconfig'
	}
};

exports.loadConfig=function() {
	if(args.env='product'){
		return product;
	}else{
		return development;
	}
};