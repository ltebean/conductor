var request = require("request");
// http://data.dp/windrunner/json/searchTags
request.post('http://127.0.0.1:8080/api/ctrproxy', {
    form: {
        url: 'www.dianping.com/shop/2469019',
        database: 'dw57',               //数据源，目前支持dw57与dw59
        date: '2013-10-22',             //查询日期
        dateRange: 1
    }
}, function(error, response, body) {
    if (error){return console.log(error);}
    if (response.statusCode == 200) {
        console.log(body)
    } else {
        console.log('error: ' + response.statusCode)
        console.log(body)
    }
})