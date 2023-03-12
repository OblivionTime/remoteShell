/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-18 14:43:38
 * @LastEditors: solid
 * @LastEditTime: 2022-11-01 18:46:31
 */
const WebSocket = require('ws');
let deviceWSClientSet = require('../../clients/screen_clients.js');



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
        deviceWSClientSet.add(room, name, ws);
        console.log("屏幕界面=>用户进入:" + name);
        if (name != room) {
            deviceWSClientSet.addNote(room, req.socket.remoteAddress);
        }
        //发送消息
        ws.on('message', message => {
            try {
                if (name == room + "_target") {
                    var goalWS = deviceWSClientSet.get(room, room)
                    if (goalWS) {
                        goalWS.send(message)
                    }
                } else if (name == room) {
                    var goalWS = deviceWSClientSet.get(room, room + "_target")
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
            console.log("屏幕界面=>" + name + "离开");
            if (deviceWSClientSet.screen_client_map.hasOwnProperty(room)) {
                deviceWSClientSet.remove(room, name);
                if (name == room) {
                    var goalWS = deviceWSClientSet.get(room, room + "_target")
                    if (goalWS) {
                        goalWS.send(Buffer.from("exit"))
                    }
                } else if (name == room + "_target") {
                    var goalWS = deviceWSClientSet.get(room, room)
                    if (goalWS) {
                        goalWS.send("连接已断开.........")
                    }
                }
            }
        });

    });
    return wss
};