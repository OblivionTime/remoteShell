/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-02 18:27:15
 * @LastEditors: solid
 * @LastEditTime: 2022-11-11 17:12:42
 */
const Promise = require('pinkie-promise')
const temp = require('temp')
const path = require('path')
var fs = require('fs');
const ffi = require('ffi-napi');
function windowsSnapshot(options = {}) {
    return new Promise((resolve, reject) => {
        const format = options.format || 'png'
        const saveFile = options.save || false
        const tmpPath = temp.path({
            suffix: `.${format}`
        })
        const imgPath = path.resolve(options.filename || tmpPath)
        const libm = ffi.Library("static/screen.dll", {
            GetFullScreen: ["void", ["string"]],
        });

        try {
            libm.GetFullScreen(imgPath);
            fs.readFile(imgPath, 'binary', function (err, data) {
                if (!saveFile && !err) {
                    fs.unlinkSync(imgPath)
                }
                if (err) {
                    return reject(err)
                } else {
                    const buffer = new Buffer.from(data, 'binary');
                    return resolve(buffer)
                }
            });
        }
        catch (error) {
            return reject(error)
        }
    })
}

module.exports = windowsSnapshot