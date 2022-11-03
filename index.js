/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 14:06:37
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 17:35:30
 */

var ShellConn = require("./featureList/shell")
var ScreenConn = require("./featureList/screen")
ShellConn("ws")
ScreenConn("screen")