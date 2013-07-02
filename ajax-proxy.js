var request = require("request");
var url = require("url");
var config = require("./config").loadConfig();
var host = config.host;

function parseHeader(req,host){
    var headers = {};

    ["x-requested-with","cookie","user-agent"].forEach(function(key){
        req.headers[key] && (headers[key] = req.headers[key]);
    })
    if(req.headers.referer){
        headers["referer"] = "http://"+ host + url.parse(req.headers.referer).path;
    }
    return headers;
}

function proxyTo(req,res,host,cb){
    request({
        url: req.protocol + "://" + host + req.url,
        method:req.method,
        form:req.body,
        headers:parseHeader(req,host)
    },cb);
}

function setHeader(res,k,v){
    if(k == "set-cookie"){
        v = v.replace(/Domain=[^;]*;/g,"");
    }

    res.set(k,v);
}

module.exports = function(req,res){

    proxyTo(req,res,host,function(err,resp,body){
        var value;
        if(err){res.send(500,err);return;}
        for(var key in resp.headers){
            value = resp.headers[key];

            if(value.constructor == Array){
                value.forEach(function(v){
                    setHeader(res,key,v);
                });
            }else{
                setHeader(res,key,value);
            }
        }

        res.set("X-Proxy-From",host);
        res.send(resp.statusCode,body);   
    });
}