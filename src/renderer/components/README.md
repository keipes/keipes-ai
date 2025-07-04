# Component Structure

This directory contains the refactored components for the Keipes AI Electron app.

## Directory Structure

```
src/renderer/
├── components/
│   ├── Header.tsx          # App header with logo and actions
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Footer.tsx          # Status bar footer
│   ├── index.ts            # Component exports
│   └── views/
│       ├── ChatView.tsx    # Chat interface component
│       ├── ImageView.tsx   # Image generation interface
│       ├── SettingsView.tsx # Settings configuration interface
│       └── index.ts        # View exports
├── hooks/
│   └── useApp.ts           # Main application state and logic hook
├── types/
│   └── app-types.ts        # Application-specific type definitions
└── App.tsx                 # Main application component
```

## Component Breakdown

### Layout Components

- **Header**: Contains the app logo and main action buttons
- **Sidebar**: Navigation menu for switching between views
- **Footer**: Status information and app version display

### View Components

- **ChatView**: Complete chat interface with message history and input
- **ImageView**: Image generation interface with prompt input and output display
- **SettingsView**: Configuration interface for API keys and preferences

### Custom Hook

- **useApp**: Centralizes all application state management and business logic

### Types

- **app-types**: Shared TypeScript interfaces for the application

## Key Benefits

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or replaced
3. **Maintainability**: Changes to one component don't affect others
4. **Type Safety**: Proper TypeScript interfaces for all props
5. **Clean Imports**: Index files make imports cleaner and more organized

## Usage

Components are exported through index files for clean imports:

```tsx
import { Header, Sidebar, Footer } from "./components";
import { ChatView, ImageView, SettingsView } from "./components/views";
```
