const { ipcMain, dialog, app } = require("electron");
const { getMainWindow } = require("../windows/main-window");

function setupIpcHandlers() {
  // App info handlers
  ipcMain.handle("get-app-version", () => {
    return app.getVersion();
  });

  // Dialog handlers
  ipcMain.handle("show-message-box", async (event, options) => {
    const mainWindow = getMainWindow();
    if (!mainWindow) return null;
    
    const result = await dialog.showMessageBox(mainWindow, options);
    return result;
  });

  ipcMain.handle("show-error-box", (event, title, content) => {
    dialog.showErrorBox(title, content);
  });
}

module.exports = {
  setupIpcHandlers
};
