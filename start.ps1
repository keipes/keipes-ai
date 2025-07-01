# Keipes AI Electron App Launcher (Windows PowerShell)
Write-Host "Starting Keipes AI Electron App..." -ForegroundColor Green

# Navigate to the script directory
$ScriptDirectory = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location -Path $ScriptDirectory
Write-Host "Working directory: $ScriptDirectory" -ForegroundColor Cyan

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Start the application in development mode
Write-Host "Launching application..." -ForegroundColor Green

# Use npm script as the primary method
Write-Host "Using npm script..." -ForegroundColor Cyan
npm start

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start Electron app" -ForegroundColor Red
    exit 1
}
