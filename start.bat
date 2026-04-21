@echo off
echo 正在启动 MyDiary 应用...
cd /d "%~dp0"
npm run electron:preview
pause