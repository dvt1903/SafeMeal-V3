@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0server"
where node >nul 2>&1
if errorlevel 1 (
  echo Vui long cai Node.js 22.13+ tu https://nodejs.org/
  pause
  exit /b 1
)
set DEMO_SEED=1
set PORT=8000
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:8000'"
echo SafeMeal V4 - dang khoi dong tai http://127.0.0.1:8000
echo KHONG DONG CUA SO NAY khi dang su dung.
node server.mjs
pause
