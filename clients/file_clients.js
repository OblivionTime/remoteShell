/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-18 14:45:08
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 18:20:14
 */
/**
 * websocket客户端集合
 * @constructor
 */
function deviceWSClientSet() { }

// websocket客户端列表
deviceWSClientSet.prototype.file_client_map = {};
// 添加
deviceWSClientSet.prototype.add = function (room, name, ws) {
    if (!this.file_client_map.hasOwnProperty(room)) {
        this.file_client_map[room] = {}
    }
    this.file_client_map[room][name] = ws
};
deviceWSClientSet.prototype.addNote = function (room, note) {
    this.file_client_map[room]["note"] = note
};
// 获得指定客户端
deviceWSClientSet.prototype.get = function (room, name) {
    return this.file_client_map[room][name];
};
deviceWSClientSet.prototype.getAllROOM = function () {
    var connList = []
    for (const key in this.file_client_map) {
        var state = this.file_client_map[key].hasOwnProperty(key + "_target")
        connList.push(
            {
                room: key,
                note: this.file_client_map[key]['note'],
                state: state
            })
    }
    return connList
};
deviceWSClientSet.prototype.updateNote = function (room, note) {
    try {
        this.file_client_map[room]['note'] = note
        return ""
    } catch (error) {
        return error
    }

};
// 移除
deviceWSClientSet.prototype.remove = function (room, name) {
    delete (this.file_client_map[room][name])
};
// 键盘指令websocket客户端对象
let deviceKeyDataClientSet = new deviceWSClientSet();

module.exports = deviceKeyDataClientSet;