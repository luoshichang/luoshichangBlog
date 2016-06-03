/**
 * Created by shichangluo on 2016/5/21.
 */
function _exec(sql,after,res) {
    var mysql = require('mysql');
    var option = {
        host     : 'r.rdc.sae.sina.com.cn',
        port : 3307,
        user     : '5xxwzly4zl',
        password : '4kxlymz351mijxkyzz403i4w320zkmy04zyiw22m',
        database : 'app_luoshichang'
    };
    var client = mysql.createConnection(option);
    client.connect(function(err){
        if (err) {
            console.log(err);
            return;
        }
        client.query(sql || '',function(err,r){
            after(err,r,res);
        });
        client.end();

    });
    client.on('error',function(err) {
        if (err.errno != 'ECONNRESET') {
            after("err01",false);
            throw err;
        } else {
            after("err02",false);
        }
    });
}

exports.exec = _exec;