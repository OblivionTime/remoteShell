/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 17:21:57
 * @LastEditors: solid
 * @LastEditTime: 2022-11-10 16:56:39
 */
"use strict";
const os = require('os');
const fs = require('fs');
let hostname = "localhost"
let port = 7880
//读取config.json文件
if (fs.existsSync("config.json")) {
    var res = JSON.parse(fs.readFileSync(`config.json`))
    hostname = res.hostname
    port = res.port
}
module.exports = {
    hostname: hostname,
    port: port,
    room: os.hostname(),
    reconnectInterval: 1000 * 60,
};