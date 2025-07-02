# Keipes AI Electron App

A modern cross-platform desktop application for AI interactions, built with Electron, TypeScript, and React. Features chat functionality and image generation using Gemini AI and OpenAI models.

## Features

- **Chat Interface**: Interactive chat with AI models using Gemini or OpenAI
- **Image Generation**: Generate images using Gemini AI or OpenAI DALL-E
- **Provider Selection**: Choose between Gemini (free) and OpenAI (requires API key) for image generation
- **Settings Management**: Configure API keys, provider preferences, and app settings
- **Cross-platform**: Runs on macOS, Windows, and Linux
- **Modern UI**: Beautiful React-based interface with dark theme and responsive design
- **TypeScript**: Fully typed codebase for better development experience

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone https://github.com/keipes/keipes-ai.git
   cd keipes-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the application:

   ```bash
   npm run build:app
   ```

4. Start the application:

   ```bash
   npm start
   ```

### Development

To run in development mode with hot reloading:

```bash
# Build main process and start with DevTools
npm run dev

# Or run both renderer and main in parallel
npm run dev:all
```

To build only the main process in watch mode:

```bash
npm run build:main:watch
```

To run the renderer in development mode:

```bash
npm run renderer:dev
```

### Building

To build the main process:

```bash
npm run build:main
```

To build the renderer:

```bash
npm run renderer:build
```

To build the entire application:

```bash
npm run build:app
```

To create platform-specific distribution packages:

```bash
npm run build
```

## Configuration

### API Keys Setup

1. Open the Settings tab in the application
2. Configure your API keys:
   - **Gemini API Key**: Required for Gemini-based chat and image generation (free tier available)
   - **OpenAI API Key**: Optional, required only if you want to use OpenAI DALL-E for image generation
3. Select your preferred image generation provider:
   - **Gemini**: Free image generation (default)
   - **OpenAI**: Higher quality images but requires API key and credits
4. Click "Save Settings" to persist your configuration

### Provider Configuration

The application supports multiple AI providers:

- **Image Generation**: Choose between Gemini (free) or OpenAI DALL-E (paid)
- **Chat**: Currently uses Gemini by default (configurable in settings)

All settings are stored locally and encrypted for security.

## Project Structure

```
keipes-ai/
├── main.ts                 # Entry point that loads the main app
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration for main process
├── tsconfig.renderer.json  # TypeScript configuration for renderer
├── vite.config.mjs         # Vite configuration for renderer build
└── src/                    # Source code
    ├── main/               # Main Electron process (TypeScript)
    │   ├── app.ts          # Main application logic
    │   ├── menu/           # Application menu
    │   ├── services/       # Main process services (IPC, logging)
    │   └── windows/        # Window management
    ├── preload/            # Preload scripts for security
    │   └── api.ts          # Exposed APIs to renderer
    ├── renderer/           # Frontend React application
    │   ├── App.tsx         # Main React component
    │   ├── index.tsx       # React entry point
    │   ├── components/     # React components
    │   ├── pages/          # Page-specific styles and assets
    │   ├── services/       # Frontend services (chat, image)
    │   └── utils/          # Utility functions and error handling
    ├── shared/             # Shared code between main and renderer
    │   └── config.ts       # Application configuration
    └── types/              # TypeScript type definitions
```

## Backend Integration

The Electron app communicates with a backend server running on `http://localhost:5001`. The application expects the following API endpoints:

### Required API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/providers` - Get available AI providers
- `POST /api/chat` - Chat with AI models
- `POST /api/generate-image` - Generate images
- `POST /api/generate-image/openai` - Generate images using OpenAI

### Backend Implementation Example

Here's an example Flask server that provides the expected API:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

@app.route('/api/providers', methods=['GET'])
def get_providers():
    return jsonify({
        'image_providers': ['gemini', 'openai'],
        'chat_providers': ['gemini', 'openai']
    })

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data['prompt']
    # Your Gemini image generation code here
    return jsonify({
        'image_base64': 'base64_encoded_image_data',
        'filename': 'generated_image.png'
    })

@app.route('/api/generate-image/openai', methods=['POST'])
def generate_image_openai():
    data = request.json
    prompt = data['prompt']
    api_key = data['api_key']
    # Your OpenAI DALL-E image generation code here
    return jsonify({
        'image_base64': 'base64_encoded_image_data',
        'filename': 'generated_image.png'
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data['message']
    # Your chat AI code here
    response = "AI response here"
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Note: port 5001, not 5000
```

### Configuration

The backend URL can be configured in `src/shared/config.ts` by modifying the `BACKEND_URL` setting.

## Available Scripts

- `npm start` - Start the built application
- `npm run dev` - Build main process and start in development mode with DevTools
- `npm run dev:all` - Run both renderer dev server and main process in parallel
- `npm run build:main` - Build the main Electron process (TypeScript compilation)
- `npm run build:main:watch` - Build main process in watch mode
- `npm run renderer:dev` - Start the renderer development server (Vite)
- `npm run renderer:build` - Build the renderer for production (Vite)
- `npm run build:app` - Build both main and renderer
- `npm run build` - Build the application and create distribution packages
- `npm run lint` - Run ESLint on the codebase
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run type-check` - Type check the main process
- `npm run type-check:renderer` - Type check the renderer process

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Desktop Framework**: Electron 30
- **Styling**: CSS with CSS variables for theming
- **State Management**: React hooks and local storage
- **Type Safety**: Full TypeScript coverage
- **Build System**: TypeScript compiler + Vite + electron-builder

## Development Workflow

1. **Setup**: Clone repo and run `npm install`
2. **Development**: Use `npm run dev:all` for full development with hot reloading
3. **Testing**: Start your backend server on port 5001
4. **Building**: Run `npm run build:app` to build for production
5. **Distribution**: Run `npm run build` to create platform packages

## Platform Support

The application is built using Electron and supports all major platforms:

- **macOS**: Builds .app bundles and .dmg installers
- **Windows**: Builds .exe installers using NSIS
- **Linux**: Builds AppImage packages for broad compatibility

Distribution packages are created using electron-builder and can be generated with `npm run build`.

## License

MIT License
