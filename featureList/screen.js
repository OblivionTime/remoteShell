/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 17:21:06
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 17:43:16
 */
var { hostname, port, room, reconnectInterval } = require("../wsConfig/config.js")
var screenshot = require('../lib/screen');
const os = require('os');
const WebSocket = require('ws');

var reconnectInterval = 1000 * 60;
var screenInterval = 1000;

var screentimer
var room = os.hostname();

function Screenconnect(wsName) {
    var screenWs = new WebSocket(`ws://${hostname}:${port}/${wsName}?room=${room}_target`);
    screenWs.on('open', function () {
        console.log("screen 连接成功");
    });
    screenWs.on("message", async (message) => {
        if (message && message.toString() == "exit") {
            console.log('screen 客户端退出');
        } else if (message && message.toString() == 'connect') {
            console.log('screen 客户端进行连接');
            screentimer = setInterval(async () => {
                var img = await screenshot({ format: 'png' })
                screenWs.send(img)
            }, screenInterval);
        }

    })
    screenWs.on('error', function (err) {
        // console.log(err);
        console.log('screen socket error');
    });
    screenWs.on('close', function () {
        console.log(' screen 连接断开!!! screen 等待重连');
        screenWs = null
        setTimeout(Screenconnect, reconnectInterval)
    });
};
module.exports = Screenconnect