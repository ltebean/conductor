var request = require("request");
module.exports = function(req,res){
    req.pipe(request(req.query.url)).pipe(res);
}