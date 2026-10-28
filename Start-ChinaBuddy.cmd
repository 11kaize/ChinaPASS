@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Please install Node.js 22.13 or newer from https://nodejs.org/
  pause
  exit /b 1
)
node scripts\start-mobile.mjs --preview %*
set "chinabuddy_exit=%errorlevel%"
if not "%chinabuddy_exit%"=="0" pause
exit /b %chinabuddy_exit%
