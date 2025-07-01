const { ipcMain, dialog, app } = require("electron");
const { getMainWindow } = require("../windows/main-window");

function setupIpcHandlers() {
  // App info handlers
  ipcMain.handle("get-app-version", () => {
    try {
      return app.getVersion();
    } catch (error) {
      console.error("Failed to get app version:", error);
      return "unknown";
    }
  });

  // Dialog handlers
  ipcMain.handle("show-message-box", async (event, options) => {
    try {
      const mainWindow = getMainWindow();
      if (!mainWindow) return null;

      const result = await dialog.showMessageBox(mainWindow, options);
      return result;
    } catch (error) {
      console.error("Error showing message box:", error);
      return null;
    }
  });

  ipcMain.handle("show-error-box", (event, title, content) => {
    try {
      dialog.showErrorBox(title, content);
    } catch (error) {
      console.error("Error showing error box:", error);
    }
  });

  // Centralized error handler
  ipcMain.handle("log-error", (event, errorInfo) => {
    console.error("Renderer Error:", errorInfo);
    // Here you could add more error handling logic like saving to a log file
  });
}

module.exports = {
  setupIpcHandlers,
};
