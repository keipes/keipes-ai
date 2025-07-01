#!/bin/bash

# Keipes AI Electron App Launcher
echo "🚀 Starting Keipes AI Electron App..."

# Navigate to the electron directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the application in development mode
echo "⚡ Launching application..."
npm run dev
