const { app, BrowserWindow } = require("electron");
const { createMainWindow } = require("./windows/main-window");
const { createApplicationMenu } = require("./menu/application-menu");
const { setupIpcHandlers } = require("./services/ipc-service");

// App event listeners
app.whenReady().then(() => {
  createMainWindow();
  createApplicationMenu();
  setupIpcHandlers();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
