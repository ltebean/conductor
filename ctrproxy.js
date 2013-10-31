var request = require("request");

// var fake_data = '{"code":200,"msg":[{"module_index":0,"module":"2_click_yychanneltab","ratio":0.0233},{"module_index":1,"module":"5_book_hotel_ctrip","ratio":0.2120},{"module_index":1,"module":"5_book_hotel_elong","ratio":0.3585},{"module_index":1,"module":"5_con_tag","ratio":0.0654},{"module_index":2,"module":"5_con_tag","ratio":0.1264},{"module_index":3,"module":"6_rec_fujin","ratio":0.0233},{"module_index":2,"module":"6_rec_kanguo_B","ratio":0.0189},{"module_index":3,"module":"6_rec_kanguo_B","ratio":0.0233}]}';

module.exports = function(req,res) {
    var body = req.body;
    // return res.send(200,fake_data);
    request.post('http://data.dp/windrunner/json/searchTags', {
        form: {
            url: body.url,
            database: body.database,               //数据源，目前支持dw57与dw59
            date: body.date,             //查询日期
            dateRange: body.dateRange
        }
    }, function(err, response, responseBody) {
        if(err){return res.send(500,err);}
        if (response.statusCode != 200) {
            return res.send(response.statusCode,"fail");
        }
        res.send(200,responseBody);
    });
};