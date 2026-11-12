@echo off
setlocal
title Smart21network - build Windows installer
cd /d "%~dp0"
echo.
echo  Smart21network: building the Windows installer
echo  ==============================================
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is not installed. Download the LTS version from https://nodejs.org , install it, then run this file again.
  pause
  exit /b 1
)
echo.
echo  [1/2] Installing build tools (needs internet, first time only)...
call npm install --no-audit --no-fund
if errorlevel 1 goto fail
echo.
echo  [2/2] Building the installer...
call npm run dist:win
if errorlevel 1 goto fail
echo.
echo  Done. The installer is in the "dist" folder:
dir /b dist\*.exe
start "" "%~dp0dist"
pause
exit /b 0
:fail
echo.
echo  The build failed. Check your internet connection and read the messages above.
pause
exit /b 1
