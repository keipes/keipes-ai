@echo off
REM Keipes AI Electron App Launcher (Windows Batch)
echo 🚀 Starting Keipes AI Electron App...

REM Navigate to the script directory
cd /d "%~dp0"
echo 📂 Working directory: %CD%

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the application in development mode
echo ⚡ Launching application...

REM Try direct electron executable first
if exist "node_modules\electron\dist\electron.exe" (
    echo 🎯 Using direct electron executable...
    "node_modules\electron\dist\electron.exe" . --dev
) else (
    echo 🎯 Using npm script...
    npm run dev
)

if errorlevel 1 (
    echo ❌ Failed to start Electron app
    pause
    exit /b 1
)
