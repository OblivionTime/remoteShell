/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-18 14:45:08
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 13:40:59
 */
/**
 * websocket客户端集合
 * @constructor
 */
function browserWSClientSet() { }

// websocket客户端列表
browserWSClientSet.prototype.browser_client_map = {};
// 添加
browserWSClientSet.prototype.add = function (room, name, ws) {
    if (!this.browser_client_map.hasOwnProperty(room)) {
        this.browser_client_map[room] = {}
    }
    this.browser_client_map[room][name] = ws
};
// 获得指定客户端
browserWSClientSet.prototype.get = function (room, name) {
    return this.browser_client_map[room][name];
};
// 移除
browserWSClientSet.prototype.remove = function (room, name) {
    delete (this.browser_client_map[room][name])
};
let browserKeyDataClientSet = new browserWSClientSet();

module.exports = browserKeyDataClientSet;