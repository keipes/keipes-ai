#!/bin/bash

# Keipes AI Backend Server Launcher
echo "🚀 Starting Keipes AI Backend Server..."

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update requirements
echo "📚 Installing/updating Python packages..."
pip install -r requirements.txt

# Start the backend server
echo "🖥️  Starting backend server..."
echo "📡 Server will be available at: http://localhost:5000"
echo "🔗 Your Electron app can now connect to this backend"
echo "💡 Use Ctrl+C to stop the server"
echo ""

python backend_server.py
