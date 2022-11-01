/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-12 14:51:35
 * @LastEditors: solid
 * @LastEditTime: 2022-11-01 10:25:05
 */
// const path = require('path')
// const fs = require('fs')
module.exports = {
    devServer: {
        port: "8888",
        // open: true,
        // https: {
        //     cert: fs.readFileSync(path.join(__dirname, 'src/ssl/server.crt')),
        //     key: fs.readFileSync(path.join(__dirname, 'src/ssl/server.key'))
        // },
        overlay: {
            warnings: false,
            errors: true
        },
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                nsis: {
                    allowToChangeInstallationDirectory: true,
                    oneClick: false,
                    installerIcon: "./src/assets/logo.ico",  //安装logo
                    installerHeaderIcon: "./src/assets/logo.ico", //安装logo
                    "guid": "xxxx",
                    "perMachine": true,
                    "allowElevation": true,
                    "createDesktopShortcut": true,
                    "createStartMenuShortcut": true,
                    "shortcutName": "remote"
                },
                "compression": "maximum", //压缩
                "asar": true,
                "directories": {
                    "output": "build", //打包后指定目录
                },
                electronDownload: {
                    mirror: "https://npm.taobao.org/mirrors/electron/" //镜像设置
                },
                win: {
                    icon: './src/assets/logo.ico',
                    "target": [
                        {
                            "target": "portable",  //分块打包
                            "arch": [
                                "x64", //64位
                                // "ia32" //32位
                            ],

                        }
                    ],
                   

                },
                productName: "remoteShell",  //应用的名称
            },
            // nodeIntegration: true,
        }
    }
}
