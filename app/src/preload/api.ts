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

  // Menu event listeners
  onMenuNew: (callback: (event: IpcRendererEvent) => void) => void;
  onMenuOpen: (
    callback: (event: IpcRendererEvent, filePath: string) => void
  ) => void;
  onMenuGenerateImage: (callback: (event: IpcRendererEvent) => void) => void;
  onMenuChat: (callback: (event: IpcRendererEvent) => void) => void;

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

  // Menu event listeners
  onMenuNew: (callback) => ipcRenderer.on("menu-new", callback),
  onMenuOpen: (callback) => ipcRenderer.on("menu-open", callback),
  onMenuGenerateImage: (callback) =>
    ipcRenderer.on("menu-generate-image", callback),
  onMenuChat: (callback) => ipcRenderer.on("menu-chat", callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

// Export types for renderer use
export type { ElectronAPI };
