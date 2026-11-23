@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Open index.html directly for the standalone app,
  echo or install Node.js to use the separate localhost subdomains.
  pause
  exit /b 1
)
node server.js
pause
