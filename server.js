/**
 * Created by shichangluo on 2016/5/20.
 */

var http=require('http');//模块加载
var url=require('url');
var fs=require('fs');
var mime=require('mime');
var querystring=require('querystring');

 var mysqlcon=require('./mysqlcon.js');//加载自己的mysql模块

var server=http.createServer();
var HtmlDir=__dirname+'/html/';//定位到html的目录下
var userAddSql=[
    'select * from articletype',
    'select * from acrticle',
];
server.on('request',function(req,res) {
    var urlStr = url.parse(req.url);//解析url
    //console.log(req.url);
    var urlStrPath = urlStr.pathname;//获取url的目标地址
    switch(urlStrPath){
        /*页面路由*/
        case '/index':
        case '/':
            sendData(HtmlDir + 'index.html', req, res);//首页
            break;
        case '/archives':
               sendData(HtmlDir + 'archives.html', req, res);//文章列表页
            break;
        case '/mylife':
            sendData(HtmlDir + 'mylife.html', req, res);//生活页
            break;
        case '/myblog':
            sendData(HtmlDir + 'myblog.html', req, res);//生活页
            break;
        case '/pic':
            sendData(HtmlDir + 'pic.html', req, res);//图片页
            break;
        case '/blog':
            sendData(HtmlDir + 'blog.html', req, res);//评论文章页面
            break;
        case '/login':
            sendData(HtmlDir + 'login.html', req, res);//登录页面
            break;
        case '/style':
            sendData(HtmlDir + 'style.html', req, res);//具体文章页
            break;

        /*处理前端请求的数据*/

        case '/ajax':        //处理文章的ajax请求
            if(req.method.toUpperCase()=='GET'){
                mysqlcon.exec(userAddSql[0],after,res)
            }
            break;
        case '/archiveDate':  //处理文章的信息页
            if(req.method.toUpperCase()=='GET') {
                var urlData=querystring.parse(urlStr.query);
                if(urlData.articleid) {   //文章类型
                    var SQL = 'select * from acrticle where articleid=' + urlData.articleid;
                    mysqlcon.exec(SQL, after, res)
                }else if(urlData.id){   //文章索引
                    var SQL = 'select * from acrticle where id=' + urlData.id;
                    mysqlcon.exec(SQL, after, res)
                }else if(urlData.lifeid){   //文章索引
                    var SQL = 'select * from life where id=' + urlData.lifeid;
                    mysqlcon.exec(SQL, after, res)
                }
                else{
                    mysqlcon.exec(userAddSql[1], after, res)
                }
            }
            break;
        case '/lifeDate':  //处理生活的信息页
            if(req.method.toUpperCase()=='GET') {
                var urlData=querystring.parse(urlStr.query);
                if(urlData.lifeid) {   //生活类型
                    var SQL = 'select * from life where articleid=' + urlData.articleid;
                    console.log(SQL);
                    mysqlcon.exec(SQL, after, res)
                }else if(urlData.id){   //生活索引
                    var SQL = 'select * from life where id=' + urlData.id;
                    mysqlcon.exec(SQL, after, res)
                }
                else{
                    var SQL = 'select * from life'
                    mysqlcon.exec(SQL, after, res)
                }
            }
            break;
        case '/data': //返回文章内容的路由
            if(req.method.toUpperCase()=='GET') {
                var urlData = querystring.parse(urlStr.query);
               if (urlData.id) {
                    var SQL = 'select * from articlecontent where id=' + urlData.id;
                    mysqlcon.exec(SQL, after, res)
                }else if (urlData.lifeid)
                  {
                    var SQL = 'select * from lifecontent where id=' + urlData.lifeid;
                    mysqlcon.exec(SQL, after, res)
                   }
            }
            break;
        case '/imgdata': //返回图片内容
            if(req.method.toUpperCase()=='GET') {

                    var SQL = 'select * from images'
                    mysqlcon.exec(SQL, after, res)

            }
            break;
        case '/comment': //返回文章内容的路由
            if(req.method.toUpperCase()=='GET') {
                var urlData = querystring.parse(urlStr.query);
                if (urlData.id) {
                    var SQL = 'select * from message where articleid=' + urlData.id;
                    mysqlcon.exec(SQL, after, res)
                }
            }
            break;
/*        case '/ajax':
            // console.log(querystring.parse(urlStr.query));
            // res.end('<h1>你请求的东西暂时不存在</h1>');
            if(req.method.toUpperCase()=='GET'){
                console.log('已收到请求');
                res.end('数据请求成功');
                /!*          var str='';
                 req.on('data',function(chunk){
                 str+=chunk;
                 })
                 req.on('end',function(){
                 console.log(querystring.parse(str));
                 })*!/
            }
            sendData(HtmlDir + 'login.html', req, res);
            break;*/
        default:
            sendData(HtmlDir + urlStr.pathname, req, res); //访问其它静态文件，如/stylesheets/index.css

    }

});
//文件读取并输出函数
function sendData(file,req,res){
    fs.readFile(file,function(err,data){
        if(err){
            res.writeHead(404,{'content':'test/html;charset=utf-8'});
            res.end('<h1>你请求的东西暂时不存在</h1>');
        }else{
            res.writeHead(200,{                     //响应客户端，将文件内容发回去
             'Content-type':mime.lookup(file)});
            res.end(data);
        }
    })
}
//数据库回调函数
var after= function(err,data,res){
    if (err) {
        console.log(err);
        return;
    }
    else{
       // console.log(JSON.stringify(data));
   res.end(JSON.stringify(data));

    }
}
server.listen(process.env.PORT);//监听端口
