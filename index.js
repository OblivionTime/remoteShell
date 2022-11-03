/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 14:06:37
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 13:55:11
 */
const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');
const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
var screenshot = require('./lib/screen');


var reconnectInterval = 1000 * 30;
var screenInterval = 1000;
var ws;
var screenWs;
var timer
var screentimer, screentimer2
var room = os.hostname();
var connect = function () {
    let ptyProcess;
    let flag = false
    // ws = new WebSocket("ws://101.34.204.112:7880/ws?room="+room+"_target");
    ws = new WebSocket("ws://192.168.6.17:7880/ws?room=" + room + "_target");
    ws.on('open', function () {
        clearInterval(timer)
        console.log("shell 连接成功");

    });
    ws.on("message", (message) => {
        if (message && message.toString() == "exit") {
            console.log(' shell 客户端退出');
            ptyProcess = null
            flag = false
        } else if (message && message.toString() == 'connect') {
            console.log('shell 客户端进行连接');
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
        console.log('shell 连接断开');
        console.log("shell 等待重连");
        timer = setInterval(connect, reconnectInterval)
    });
};
var connect2 = function () {
    let flag = false
    // ws = new WebSocket("ws://101.34.204.112:7880/ws?room="+room+"_target");
    screenWs = new WebSocket("ws://192.168.6.17:7880/screen?room=" + room + "_target");
    screenWs.on('open', function () {
        clearInterval(screentimer)
        console.log("screen 连接成功");

    });
    screenWs.on("message", async (message) => {
        if (message && message.toString() == "exit") {
            clearInterval(screentimer2)
            console.log('screen 客户端退出');
            flag = false
        } else if (message && message.toString() == 'connect') {
            console.log('screen 客户端进行连接');
            screentimer2 = setInterval(async () => {
                var img = await screenshot({ format: 'png' })
                screenWs.send(img)
            }, screenInterval);
            flag = true
        }

    })
    screenWs.on('error', function () {
        console.log('socket error');
    });
    screenWs.on('close', function () {
        console.log(' screen 连接断开');
        console.log(" screen 等待重连");
        screentimer = setInterval(connect, reconnectInterval)
    });
};
connect();
connect2();