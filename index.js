/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 10:04:38
 * @LastEditors: solid
 * @LastEditTime: 2022-11-10 16:00:00
 */
const url = require('url');
var app = require('./app/app');
var server = require("http").createServer(app);
const device_ws_server = require('./ws/deviceWs/deviceWs')();
const screen_ws_server = require('./ws/screenWs/screenWs')();
const file_ws_server = require('./ws/fileWs/fileWs')();
const browser_ws_server = require('./ws/browserWs/browserWs')();
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
    }else if( pathname === '/browser'){
        browser_ws_server.handleUpgrade(request, socket, head, socket => {
            browser_ws_server.emit('connection', socket, request);
        });
    }
});
//启动服务
server.listen("7880", "0.0.0.0", function () {
    console.log(`websocket running at ws://0.0.0.0:7880`);
});