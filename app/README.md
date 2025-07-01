# Keipes AI Electron App

A modern desktop application for AI interactions, built with Electron.

## Features

- **Chat Interface**: Interactive chat with AI models
- **Image Generation**: Generate images using Gemini AI
- **Settings Management**: Configure API keys and preferences
- **Cross-platform**: Runs on macOS, Windows, and Linux
- **Modern UI**: Beautiful dark theme with responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the electron directory:

   ```bash
   cd ui/electron
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

   Or use the convenience script:

   ```bash
   ./start.sh
   ```

### Development

To run in development mode with DevTools:

```bash
npm run dev
```

### Building

To build the application for distribution:

```bash
npm run build
```

To create platform-specific packages:

```bash
npm run dist
```

## Configuration

1. Open the Settings tab in the application
2. Enter your API keys:
   - Gemini API Key (for image generation and chat)
   - OpenAI API Key (optional, for additional features)
3. Click "Save Settings"

## Project Structure

```
app/
├── main.js              # Main Electron process
├── package.json         # Dependencies and scripts
├── start.sh            # Launch script
└── src/                # Source code
    ├── main/           # Main process code
    ├── preload/        # Preload scripts for security
    └── renderer/       # Frontend files
        ├── pages/      # HTML/JS/CSS files
        ├── components/ # UI components
        ├── services/   # Business logic
        └── utils/      # Utility functions
    ├── styles.css      # Styling
    └── renderer.js     # Frontend JavaScript
```

## Integration with Python Backend

The Electron app is designed to work with your existing Python AI scripts. To integrate:

1. Create a Python Flask/FastAPI server that exposes your AI functionality
2. Update the `generateImageWithGemini()` and `chatWithAI()` functions in `renderer.js`
3. Make HTTP requests to your Python backend

Example Python Flask integration:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data['prompt']
    # Your existing image generation code here
    # Return the image URL or base64 data
    return jsonify({'imageUrl': 'path/to/image.png'})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data['message']
    # Your existing chat code here
    response = "AI response here"
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## Available Scripts

- `npm start` - Start the application
- `npm run dev` - Start in development mode with DevTools
- `npm run build` - Build the application
- `npm run dist` - Create distribution packages
- `npm run pack` - Package without creating installers

## Platform Support

- **macOS**: Builds .app and .dmg files
- **Windows**: Builds .exe installer
- **Linux**: Builds AppImage

## License

MIT License
