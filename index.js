/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 10:04:38
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 18:20:56
 */
const url = require('url');
var app = require('./app/app');
var server = require("http").createServer(app);
const device_ws_server = require('./deviceWs/deviceWs')();
const screen_ws_server = require('./screenWs/screenWs')();
const file_ws_server = require('./fileWs/fileWs')();
// 协议提升
server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;
    // 处理键盘指令的websocket
    if (pathname === '/ws') {
        device_ws_server.handleUpgrade(request, socket, head, socket => {
            device_ws_server.emit('connection', socket, request);
        });
    } else if (pathname === '/screen') {
        screen_ws_server.handleUpgrade(request, socket, head, socket => {
            screen_ws_server.emit('connection', socket, request);
        });
    } else if (pathname === '/file') {
        file_ws_server.handleUpgrade(request, socket, head, socket => {
            file_ws_server.emit('connection', socket, request);
        });
    }
});
//启动服务
server.listen("7880", "0.0.0.0", function () {
    console.log(`websocket running at ws://0.0.0.0:7880`);
});