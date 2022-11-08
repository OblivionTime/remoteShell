/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-02 18:27:15
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 13:53:57
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
        const libm = ffi.Library("screen.dll", {
            GetFullScreen: ["void", ["string"]],
        });

        try {
            libm.GetFullScreen(imgPath);
            fs.readFile(imgPath, 'binary', function (err, data) {
                if (!saveFile) {
                    fs.unlinkSync(imgPath)
                }
                if (err) {
                    return reject(error)
                } else {
                    const buffer = new Buffer.from(data, 'binary');
                    return resolve(buffer)
                }
            });
        }
        catch (error) {
            console.log(error);
            return reject(error)
        }
    })
}

module.exports = windowsSnapshot