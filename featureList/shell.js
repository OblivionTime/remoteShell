/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 17:21:06
 * @LastEditors: solid
 * @LastEditTime: 2022-11-11 17:32:34
 */
var { hostname, port, room, reconnectInterval } = require("../wsConfig/config.js")
const WebSocket = require('ws');
const os = require('os');
const pty = require('node-pty');
const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
function Shellconnect(wsName) {
    let ptyProcess;
    let flag = false
    var ws = new WebSocket(`ws://${hostname}:${port}/${wsName}?room=${room}_target&os=${os.platform()}`);
    ws.on('open', function () {
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
                cols: 147,
                rows: 43,
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
    ws.on('error',function(){
    })
    ws.on('close', function () {
        console.log('命令行 连接断开=====>命令行 60s后将进行重连');
        ws = null
        setTimeout(Shellconnect, reconnectInterval)
    });
};
module.exports = Shellconnect