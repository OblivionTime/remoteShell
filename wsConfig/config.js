/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 17:21:57
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 17:36:02
 */
"use strict";
const os = require('os');
module.exports = {
    hostname: "192.168.6.17",
    port: 7880,
    room: os.hostname(),
    reconnectInterval: 1000 * 60,
};