/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 17:21:06
 * @LastEditors: solid
 * @LastEditTime: 2022-11-07 18:10:06
 */
var { hostname, port, room, reconnectInterval } = require("../wsConfig/config.js")
const os = require('os');
const WebSocket = require('ws');
const fs = require("fs")
const d = require('../lib/diskinfo');
var room = os.hostname();
function formDate(data, format) {
    // console.log("data,time");
    let time = {
        "M+": data.getMonth() + 1,
        "D+": data.getDate(),
        "H+": data.getHours(),
        "m+": data.getMinutes(),
        "s+": data.getSeconds(),
    };

    if (/(y+)/i.test(format)) {
        format = format.replace(
            RegExp.$1,
            (data.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }

    for (let k in time) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? time[k]
                    : ("00" + time[k]).substr(("" + time[k]).length)
            );
        }
    }
    return format;
}

//获取指定目录下所有文件
function getAllFiles(root) {
    var res = [], files = fs.readdirSync(root);
    files.forEach(function (file) {
        try {
            var pathname = root + '/' + file
                , stat = fs.statSync(pathname);
            var accessTime=formDate(stat.atime, "yyyy-MM-DD HH:mm:ss")
            var createTime=formDate(stat.ctime, "yyyy-MM-DD HH:mm:ss")
            var updateTime=formDate(stat.mtime, "yyyy-MM-DD HH:mm:ss")
            if (!stat.isDirectory()) {
                if (stat.size <= 2097152) {
                    res.push({ root: root, fileName: file, IsDir: false, isUs: false, size: stat.size, readEnable: true,accessTime:accessTime, createTime:createTime,updateTime:updateTime})
                } else {
                    res.push({ root: root, fileName: file, IsDir: false, isUs: false, size: stat.size, readEnable: false,accessTime:accessTime, createTime:createTime,updateTime:updateTime })
                }
            } else {
                res.push({ root: root, fileName: file, IsDir: true, isUs: false, size: 0, readEnable: false,accessTime:accessTime, createTime:createTime,updateTime:updateTime })
            }
        } catch (error) {
            res.push({ root: root, fileName: file, IsDir: false, isUs: true, size: 0, readEnable: false,accessTime:"", createTime:"",updateTime:"" })
        }
    });
    return res
}
//获取磁盘信息
function getDrives(callback) {
    d.getDrives(function (err, aDrives) {
        var res = []
        for (const drive of aDrives) {
            res.push({ root: "", fileName: drive.mounted, IsDir: true, isUs: false, size: drive.blocks })
        }
        return callback(res)
    })

}
//读取文件内容
function ReadFile(filePath) {
    var data = fs.readFileSync(filePath, "binary")
    const buffer = new Buffer.from(data, 'binary');
    return buffer
}
//写文件
function UpdataFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, data)
        return "修改成功"
    } catch (error) {
        return "修改失败"
    }

}
function FileSystemConnect(wsName) {
    var fileWs = new WebSocket(`ws://${hostname}:${port}/${wsName}?room=${room}_target`);
    fileWs.on('open', function () {
        console.log("filesystem 连接成功");
    });
    let uploadFilePath = ""
    function WriteFile(data) {
        fs.appendFileSync(uploadFilePath, data, (err) => { })
    }
    fileWs.on("message", (message) => {
        try {
            var data = JSON.parse(message)
            let res = ""
            var flag = true
            switch (data.operation) {
                case "ls":
                    flag = false
                    if (data.root == "/" && os.platform() == "win32") {
                        getDrives((r) => {
                            return fileWs.send(JSON.stringify(r))
                        })
                    } else {
                        res = getAllFiles(data.root)
                        fileWs.send(JSON.stringify(res))
                    }
                    break;
                case "updataFile":
                    res = UpdataFile(data.root, data.data)
                    break
                case "readFile":
                case "download":
                    flag = false
                    res = ReadFile(data.root)
                    fileWs.send(res)
                    break
                case "delete":
                    try {
                        fs.unlinkSync(data.root)
                        res = "删除成功"
                    } catch (error) {
                        res = "删除失败"
                    }
                    break
                case "file_upload_start":
                    //开始上传文件
                    uploadFilePath = data.root
                    res = "start"
                    return
                case "file_upload_end":
                    //结束上传
                    uploadFilePath = ""
                    res = "end"
                    return
                case "exit":
                    res = "exit"
                    break;
                default:
                    res = "操作不存在"
                    break;
            }
            if (flag) {
                fileWs.send(res)
            }
        } catch (err) {
            //文件上传
            WriteFile(message)
        }

    })
    fileWs.on('close', function () {
        console.log(' filesystem 连接断开!!! filesystem 等待重连');
        fileWs = null
        setTimeout(FileSystemConnect, reconnectInterval)
    });
};
module.exports = FileSystemConnect