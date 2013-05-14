var args = require('optimist').argv;
var fs = require('fs');

var config;

exports.loadConfig = function() {
	if (!config) {
		var path = args.config;
		var s = fs.readFileSync(path.toString(), 'utf8');
		config=JSON.parse(s);
	    //console.log(config);
	}
	return config;
};