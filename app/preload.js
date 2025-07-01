const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
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

  // Error logging
  logError: (errorInfo) => ipcRenderer.invoke("log-error", errorInfo),

  // Connection status
  onDisconnect: (callback) => {
    window.addEventListener("offline", callback);
    return () => window.removeEventListener("offline", callback);
  },

  onReconnect: (callback) => {
    window.addEventListener("online", callback);
    return () => window.removeEventListener("online", callback);
  },
});
