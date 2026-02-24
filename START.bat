@echo off
echo ========================================
echo StackOverflow Subscription System
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Checking MongoDB connection...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
