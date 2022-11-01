/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-19 11:46:56
 * @LastEditors: solid
 * @LastEditTime: 2022-11-01 15:47:52
 */
/**
 * 服务器
 */
var express = require('express');
let deviceWSClientSet = require('../clients/device_clients.js');
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json()); //parse application/json
/**
 * 加载数据库
 */
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Accept,Content-type");
    res.header("Access-Control-Allow-Credentials", true);
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8")
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
});
app.get("/", function (req, res) {
    res.send("开启!!!!!!!")
})
app.get('/list', (req, res) => {
    let resp = {
        code: 0,
        data: deviceWSClientSet.getAllROOM(),
        message: "success",
    }
    res.send(JSON.stringify(resp))
})
app.post('/updateNote', (req, res) => {
    var { room, note } = req.body;
    let resp = {
        code: 0,
        data: "",
        message: "success"
    }
    var err = deviceWSClientSet.updateNote(room, note)
    if (err) {
        resp = {
            code: 400,
            data: "",
            message: err
        }
        return res.send(JSON.stringify(resp))
    }
    res.send(JSON.stringify(resp))
})
module.exports = app