/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-18 14:43:38
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 13:46:48
 */
const WebSocket = require('ws');
let browserKeyDataClientSet = require('../../clients/browser_clients.js');



module.exports = function () {
    const wss = new WebSocket.Server({ noServer: true, maxPayload: 5 * 1024 * 1024 * 1024, });
    wss.on('connection', (ws, req) => {
        let url, name, room
        //获取name
        url = req.url.split("?")[1];
        name = url.split('=')[1];
        if (name.lastIndexOf("_target") >= 0) {
            room = name.slice(0, name.lastIndexOf("_target"))
        } else {
            room = name
        }
        browserKeyDataClientSet.add(room, name, ws);
        console.log("浏览器界面=>用户进入:" + name);
        //发送消息
        ws.on('message', message => {
            try {
                if (name == room + "_target") {
                    var goalWS = browserKeyDataClientSet.get(room, room)
                    if (goalWS) {
                        goalWS.send(message)
                    }
                } else if (name == room) {
                    var goalWS = browserKeyDataClientSet.get(room, room + "_target")
                    if (goalWS) {
                        goalWS.send(message)
                    }
                }
            } catch (error) {
                console.log(error);
            }

        });

        //退出
        ws.on('close', () => {
            console.log("浏览器界面=>" + name + "离开");
            if (browserKeyDataClientSet.browser_client_map.hasOwnProperty(room)) {
                browserKeyDataClientSet.remove(room, name);
                if (name == room) {
                    var goalWS = browserKeyDataClientSet.get(room, room + "_target")
                    if (goalWS) {
                        var resp = {
                            "root": "",
                            "operation": "exit",
                            "data": ""
                        }
                        goalWS.send(Buffer.from(JSON.stringify(resp)))
                    }
                } else if (name == room + "_target") {
                    var goalWS = browserKeyDataClientSet.get(room, room)
                    if (goalWS) {
                        goalWS.send("连接已断开.........")
                    }
                }
            }
        });

    });
    return wss
};