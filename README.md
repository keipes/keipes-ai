# Keipes AI - Full Stack Desktop Application

A complete AI-powered desktop application with Python backend and Electron frontend, integrating Google Gemini and OpenAI services.

## 🚀 Features

- **Desktop UI**: Modern Electron-based interface
- **AI Chat**: Powered by Google Gemini
- **Image Generation**: Support for both Gemini and OpenAI DALL-E
- **Cross-Platform**: macOS, Windows, Linux support
- **Real-time Integration**: Live connection between frontend and backend

## 📁 Project Structure

```
keipes-ai/
├── 🐍 Python Backend
│   ├── backend_server.py      # Flask API server
│   ├── requirements.txt       # Python dependencies
│   ├── start_backend.sh      # Backend launcher
│   └── gemini/               # Original Gemini scripts
│       └── main.py
├── ⚡ Electron Frontend
│   └── ui/electron/
│       ├── main.js           # Electron main process
│       ├── src/              # Source code
│       │   ├── main/         # Main process
│       │   ├── preload/      # Security bridge
│       │   └── renderer/     # UI code
│       └── package.json      # Node dependencies
│           └── renderer.js
└── 🚀 Launchers
    ├── start_full_app.sh     # Start everything
    └── start_backend.sh      # Backend only
```

## 🛠️ Quick Start

### Option 1: Start Everything at Once

```bash
./start_full_app.sh
```

### Option 2: Start Components Separately

**1. Start Backend Server:**

```bash
./start_backend.sh
```

**2. Start Electron App (in another terminal):**

```bash
cd ui/electron
npm install  # First time only
npm run dev
```

## 📋 Prerequisites

- **Python 3.8+** (with pip)
- **Node.js 16+** (with npm)
- **API Keys**:
  - Google Gemini API key (included)
  - OpenAI API key (optional, for DALL-E)

## 🔧 Setup Instructions

### 1. Clone and Navigate

```bash
cd /path/to/keipes-ai
```

### 2. Backend Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd ui/electron
npm install
```

### 4. Configuration

1. Launch the Electron app
2. Go to Settings tab
3. Enter your API keys:
   - Gemini API key (pre-configured)
   - OpenAI API key (for DALL-E features)
4. Select your preferred image generation provider
5. Click "Save Settings"

## 🖥️ Usage

### Chat Interface

- Type messages in the chat input
- AI responses powered by Google Gemini
- Real-time conversation history

### Image Generation

- Switch to "Image Generation" tab
- Enter descriptive prompt
- Choose provider (Gemini or OpenAI)
- Click "Generate Image"
- Download generated images

### Settings

- Configure API keys
- Select image generation provider
- Toggle preferences

## 🔌 API Endpoints

The Python backend exposes these REST APIs:

- `GET /health` - Server health check
- `POST /api/chat` - Chat with Gemini
- `POST /api/generate-image/gemini` - Generate image with Gemini
- `POST /api/generate-image/openai` - Generate image with OpenAI
- `POST /api/config` - Update configuration
- `GET /api/providers` - Get available providers

## 🛠️ Development

### Backend Development

```bash
# Start backend in development mode
python backend_server.py
```

### Frontend Development

```bash
cd ui/electron
npm run dev  # Starts with DevTools
```

### Building for Distribution

```bash
cd ui/electron
npm run build    # Build app
npm run dist     # Create installer
```

## 🔒 Security Features

- Electron context isolation enabled
- No node integration in renderer
- API keys stored locally only
- CORS protection on backend

## 📊 System Architecture

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   Electron UI   │ ◄──────────────► │  Python Backend  │
│                 │                  │                  │
│ • Chat          │                  │ • Flask Server   │
│ • Image Gen     │                  │ • Gemini Client  │
│ • Settings      │                  │ • OpenAI Client  │
└─────────────────┘                  └──────────────────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │   AI Services    │
                                     │                  │
                                     │ • Google Gemini  │
                                     │ • OpenAI DALL-E  │
                                     └──────────────────┘
```

## 🐛 Troubleshooting

### Backend Issues

- **Server won't start**: Check Python dependencies with `pip list`
- **API errors**: Verify API keys in settings
- **Port conflicts**: Backend uses port 5000

### Frontend Issues

- **App won't launch**: Check Node.js version (`node --version`)
- **Backend connection failed**: Ensure backend server is running
- **Image generation fails**: Check API key configuration

### Common Solutions

```bash
# Reset Python environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Reset Node modules
cd ui/electron
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License - see original project for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test with both backend and frontend
5. Submit pull request

---

**Happy coding! 🎉**
