const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring=require('querystring');

// 导入数据库模块
const hero = require('./data/hero.js');


let server = http.createServer((req, res) => {
    console.log(req.url);
    let urlObjc = url.parse(req.url, true);
    //接口文档路径
    let pathname = urlObjc.pathname;
    let qurey = urlObjc.query;

    //路由设计
    if (pathname == "/" && req.method == "GET") {
        fs.readFile(path.join(__dirname, 'views', 'heroList.html'), (err, data) => {
            if (err) {
                throw err;
            } else {
                res.end(data);
            }
        })
    } else if (pathname == '/heroList' && req.method == 'GET') { //获取英雄列表数据
        hero.find((err, data) => {
            if (err) {
                throw err;
            } else {
                res.end(data);
            };
        });

    } else if (pathname == '/heroAdd' && req.method == 'POST') { //添加英雄
        //1接受post请求参数
        let postData="";
        //(1)给req注册data事件
        req.on('data',(chuck)=>{
            postData+=chuck;
        });
        //(2)给req注册end事件
        req.on('end',()=>{
            //(3)使用quertstring解析
            let postObjc=querystring.parse(postData);
            hero.add(postObjc, (err) => {
                // 0:插入成功  500：插入失败
                if (err) {
                    res.end(JSON.stringify({
                        err_code: 500,
                        err_msg: err
                    }));
                } else {
                    //3.响应处理结果
                    res.end(JSON.stringify({
                        err_code: 0,
                        err_msg: 'success'
                    }));
                }
            })
        })


    } else if (pathname == '/heroInfo' && req.method == 'GET') { //根据id查询英雄数据
        //1获取参数id
        let heroID=urlObjc.query.id;
        // 2.处理数据库
        hero.find(heroID,(err,data)=>{
            if(err){
                throw err;
            }else{
                res.end(data);
            }
        })


    } else if (pathname == '/heroDelete' && req.method == 'GET') { //删除
          //1获取参数id
          let heroID=urlObjc.query.id;
          hero.delete(heroID,(err)=>{
              if(err){
                  throw err
              }else{
                //重定向，302
                res.writeHead(302,{
                    'Location':"/"
                })
                res.end();
              }
          });


    } else if (pathname.indexOf('/node_modules') == 0 || pathname.indexOf('/views') == 0) { //托管静态资源，就是以/views开头的
        fs.readFile(path.join(__dirname, pathname), (err, data) => {
            if (err) {
                throw err;
            } else {
                res.end(data);
            }
        })

    } else {
        res.end('404 not found');
    }

})


server.listen(5000, () => {
    console.log('success');
})