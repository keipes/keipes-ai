## Instructions

### App

- Electron app with React, Vite and TypeScript

### Coding Style

- Write concise code
- Focus on small incremental changes
- Define clear interfaces before implementing features
- Do not write tests unless explicitly requested

### Communication Style

- Use concise language
- No personality or emotion

### Environment

- Windows-compatible commands

### Command Triggers

- "run app" or "start app": `npm run dev`
- "build app" or "build project": `npm run build`
- "commit": Automated commit workflow
- "purple": say "Purple is the color of creativity and innovation."

### Git Workflow

- Batch operations: Combine status checks, staging, committing, and pushing
- Minimize user input
- Never auto-push: Always ask before pushing
- Commit messages: Generate for the user in a concise, descriptive, conventional format
- Squash recommendation: Offer to squash local commits before pushing

### Logs

- Log files are stored at %APPDATA%/keipes-ai-electron/logs
- Log file names: `app-${new Date().toISOString().split("T")[0]}.log`

## File Structure

The Keipes AI Electron application is organized into the following structure:

### Root Directory

- `main.ts`: Entry point for the Electron application.
- `package.json`: Contains metadata, dependencies, and scripts for the project.
- `README.md`: Documentation for the project.
- `tsconfig.json`: TypeScript configuration for the main process.
- `tsconfig.renderer.json`: TypeScript configuration for the renderer process.
- `vite.config.mjs`: Configuration file for Vite.

### `src` Directory

#### `main`

- `app.ts`: Main application logic for the Electron backend.
- `menu/application-menu.ts`: Defines the application menu.
- `services/ipc-service.ts`: Handles inter-process communication.
- `services/logger.ts`: Provides logging functionality.
- `services/dummy/`
  - `dummy-ai-service.ts`: Dummy AI service implementation.
  - `dummy-chat-service.ts`: Dummy chat service implementation.
  - `dummy-image-service.ts`: Dummy image service implementation.
- `services/openai/`
  - `openai-chat-service.ts`: OpenAI chat service implementation.
  - `openai-image-service.ts`: OpenAI image service implementation.
  - `openai-service.ts`: OpenAI service manager.
- `windows/main-window.ts`: Manages the main application window.

#### `preload`

- `api.ts`: Preload script for exposing APIs to the renderer process.

#### `renderer`

- `App.tsx`: Main React component for the renderer process.
- `index.tsx`: Entry point for the React application.
- `components/view-manager.ts`: Manages switching between different views in the application.
- `pages/index.html`: HTML template for the renderer process.
- `pages/styles.css`: Global styles for the application.
- `utils/common.ts`: Contains shared utility functions.
- `utils/error-handling.ts`: Provides error handling utilities.

#### `shared`

- `config.ts`: Shared configuration between the main and renderer processes.

#### `types`

- `ai-service-interface.ts`: Type definitions for AI service.
- `chat-service-interface.ts`: Type definitions for chat service.
- `electron.d.ts`: Type definitions for Electron.
- `image-service-interface.ts`: Type definitions for image service.
- `service-interface.ts`: General service type definitions.
