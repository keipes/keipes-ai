import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  MessageBoxOptions,
  MessageBoxReturnValue,
} from "electron";

interface ElectronAPI {
  // App info
  getAppVersion: () => Promise<string>;

  // Dialog methods
  showMessageBox: (
    options: MessageBoxOptions
  ) => Promise<MessageBoxReturnValue | null>;
  showErrorBox: (title: string, content: string) => Promise<void>;

  // Chat service methods
  chatSendMessage: (message: string) => Promise<string>;
  chatClearHistory: () => Promise<void>;
  chatGetHistory: () => Promise<any[]>;

  // Image generation method
  imageGenerate: (
    prompt: string,
    provider: string
  ) => Promise<{ image_base64: string }>;

  // Menu event listeners
  onMenuNew: (callback: (event: IpcRendererEvent) => void) => void;
  onMenuOpen: (
    callback: (event: IpcRendererEvent, filePath: string) => void
  ) => void;
  onMenuGenerateImage: (callback: (event: IpcRendererEvent) => void) => void;
  onMenuChat: (callback: (event: IpcRendererEvent) => void) => void;

  // Error logging method
  logError: (errorInfo: {
    message: string;
    code: string;
    stack?: string;
    context: Record<string, any>;
    timestamp: string;
  }) => Promise<void>;

  // API key storage methods
  storeApiKey: (provider: string, key: string) => Promise<boolean>;
  getApiKey: (provider: string) => Promise<string | null>;
  clearApiKey: (provider: string) => Promise<boolean>;

  // Provider management methods
  setProvider: (provider: string) => Promise<void>;
  getProviderName: () => Promise<string>;
  listProviders: () => Promise<string[]>;

  // Remove listeners
  removeAllListeners: (channel: string) => void;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // Dialog methods
  showMessageBox: (options) => ipcRenderer.invoke("show-message-box", options),
  showErrorBox: (title, content) =>
    ipcRenderer.invoke("show-error-box", title, content),

  // Chat service methods
  chatSendMessage: (message) =>
    ipcRenderer.invoke("chat-send-message", message),
  chatClearHistory: () => ipcRenderer.invoke("chat-clear-history"),
  chatGetHistory: () => ipcRenderer.invoke("chat-get-history"),

  // Image generation method
  imageGenerate: (prompt, provider) =>
    ipcRenderer.invoke("image-generate", prompt, provider),

  // Menu event listeners
  onMenuNew: (callback) => ipcRenderer.on("menu-new", callback),
  onMenuOpen: (callback) => ipcRenderer.on("menu-open", callback),
  onMenuGenerateImage: (callback) =>
    ipcRenderer.on("menu-generate-image", callback),
  onMenuChat: (callback) => ipcRenderer.on("menu-chat", callback),

  // Error logging method
  logError: (errorInfo) => ipcRenderer.invoke("log-error", errorInfo),

  // API key storage
  storeApiKey: (provider, key) =>
    ipcRenderer.invoke("store-api-key", provider, key),
  getApiKey: (provider) => ipcRenderer.invoke("get-api-key", provider),
  clearApiKey: (provider) => ipcRenderer.invoke("clear-api-key", provider),

  // Provider management methods
  setProvider: (provider) => ipcRenderer.invoke("set-provider", provider),
  getProviderName: () => ipcRenderer.invoke("get-provider-name"),

  listProviders: () => ipcRenderer.invoke("list-providers"),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

// Export types for renderer use
export type { ElectronAPI };
