/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 17:21:06
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 18:17:42
 */
var { hostname, port, room, reconnectInterval } = require("../wsConfig/config.js")
var screenshot = require('../lib/screen');
const WebSocket = require('ws');
var screenInterval = 1000;



function Screenconnect(wsName) {
    var screentimer
    var screenWs = new WebSocket(`ws://${hostname}:${port}/${wsName}?room=${room}_target`);
    screenWs.on('open', function () {
        console.log("screen 连接成功");
    });
    screenWs.on("message", async (message) => {
        if (message && message.toString() == "exit") {
            console.log('screen 客户端退出');
            clearInterval(screentimer)
        } else if (message && message.toString() == 'connect') {
            console.log('screen 客户端进行连接');
            screentimer = setInterval(async () => {
                var img = await screenshot({ format: 'png' })
                screenWs.send(img)
            }, screenInterval);
        }

    })
    screenWs.on('close', function () {
        clearInterval(screentimer)
        console.log(' screen 连接断开!!! screen 等待重连');
        screenWs = null
        setTimeout(Screenconnect, reconnectInterval)
    });
};
module.exports = Screenconnect