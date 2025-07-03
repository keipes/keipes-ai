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

### Git Workflow

- Batch operations: Combine status checks, staging, committing, and pushing
- Minimize user input
- Never auto-push: Always ask before pushing
- Commit messages: Concise, descriptive, conventional format
- Squash recommendation: Offer to squash local commits before pushing

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
- `windows/main-window.ts`: Manages the main application window.

#### `preload`

- `api.ts`: Preload script for exposing APIs to the renderer process.

#### `renderer`

- `App.tsx`: Main React component for the renderer process.
- `index.tsx`: Entry point for the React application.

##### `components`

- `view-manager.ts`: Manages switching between different views in the application.

##### `pages`

- `index.html`: HTML template for the renderer process.
- `styles.css`: Global styles for the application.

##### `services`

- `chat-service.ts`: Handles chat-related functionality.
- `image-service.ts`: Handles image generation functionality.

##### `utils`

- `common.ts`: Contains shared utility functions.
- `error-handling.ts`: Provides error handling utilities.

#### `shared`

- `config.ts`: Shared configuration between the main and renderer processes.

#### `types`

- `electron.d.ts`: Type definitions for Electron.
