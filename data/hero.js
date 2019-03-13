const fs = require('fs');
const path = require('path');

/**
 * 第一个参数：英雄ID   可选参数，不传则返回所有英雄
 * 第二个参数：回调函数
 * err：错误信息
 * jsonData：json文件数据 
 */
module.exports.find = (heroID, callback) => {
    // 1.读取json数据
    fs.readFile(path.join(__dirname, 'hero.json'), 'utf-8', function (err, jsonData) {
        if (typeof heroID == 'function') {
            if (err) {
                heroID(err, null);
            } else {
                heroID(null, jsonData);
            }
        } else {
            if (err) {
                callback(err, null);
            } else {
                let arr = JSON.parse(jsonData).heros;
                arr.forEach(element => {
                    if (element.id == heroID) {
                        callback(err, JSON.stringify(element));
                    };
                });
            }

        };
    });
};


/**
 * 第一个参数：要添加的英雄对象
 * 第二个参数：回调函数
 * err：错误信息 
 */
module.exports.add = (postObjc, callback) => {
    fs.readFile(path.join(__dirname, 'hero.json'), 'utf-8', function (err, jsonData) {
        if (err) {
            callback(err);
            return;
        };
        //将json字符串转为json对象
        let jsonObjc = JSON.parse(jsonData);
        //将数据添加到json对象数组
        //客户端提交的英雄对象没有id属性，id属性需要根据数据库中数据长度来+1
        postObjc.id = jsonObjc.heros.length + 1;
        jsonObjc.heros.push(postObjc);
        //写入文件需要将json对象转为json字符串
        //stringify有三个参数  第一个参数：要转换的json对象 第二个参数：替换字段函数 通常为null 第三个参数：美化输出的缩进
        let jsonStr = JSON.stringify(jsonObjc, null, "  ");
        fs.writeFile(path.join(__dirname, 'hero.json'), jsonStr, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        })
    })
};

/**
 * 第一个参数：要删除的英雄ID
 * 第二个参数：回调函数
 * err：错误信息 
 */
module.exports.delete = (heroID, callback) => {
    //2.1 读取json文件
    fs.readFile(path.join(__dirname, 'hero.json'), 'utf-8', function (err, jsonData) {
        if (err) {
            callback(err);
        };
        //2.2 将json字符串转为json对象
        let jsonObjc = JSON.parse(jsonData);
        //2.3 这里英雄id需要-1 因为数组的下标从0开始 而json数据的id从1开始
        //第一个参数：要删除的起始位置  第二个参数：要删除的个数  第三个-第N个参数：删除位置插入的数据
        jsonObjc.heros.splice(heroID - 1, 1);
        //2.4 参数英雄id之后的英雄id前移
        jsonObjc.heros.forEach(function (item) {
            if (item.id > heroID) {
                item.id -= 1;
            };
        });
        //2.5 将删除之后的数据写入json文件
        fs.writeFile(path.join(__dirname, 'hero.json'), JSON.stringify(jsonObjc, null, "  "), function (err) {
            if (err) {
                callback(err);
            }else{
                callback(null);
            }
        })
    })
};