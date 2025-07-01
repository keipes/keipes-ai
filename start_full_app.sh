#!/bin/bash

# Keipes AI Full Stack Launcher
echo "🚀 Starting Keipes AI Full Stack Application..."

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend server stopped"
    fi
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Step 1: Install Python dependencies if needed
echo "📦 Checking Python dependencies..."
cd "$SCRIPT_DIR"

if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found in $SCRIPT_DIR"
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update requirements
echo "📚 Installing Python packages..."
pip install -r requirements.txt > /dev/null 2>&1

# Step 2: Start Python backend server
echo "🖥️  Starting Python backend server..."
python backend_server.py &
BACKEND_PID=$!

# Wait a moment for server to start
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    echo "📡 Backend available at: http://localhost:5000"
else
    echo "❌ Failed to start backend server"
    exit 1
fi

# Step 3: Start Electron app
echo "⚡ Starting Electron application..."
cd "$SCRIPT_DIR/app"

# Install Electron dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Electron dependencies..."
    npm install > /dev/null 2>&1
fi

# Start Electron app
echo "🎨 Launching Electron UI..."
npm run dev

# This line will be reached when Electron app closes
echo "👋 Electron app closed"
