import {
  ipcMain,
  dialog,
  app,
  IpcMainInvokeEvent,
  MessageBoxOptions,
} from "electron";
import { getMainWindow } from "../windows/main-window";

interface ErrorInfo {
  message: string;
  stack?: string;
  [key: string]: any;
}

export function setupIpcHandlers(): void {
  // App info handlers
  ipcMain.handle("get-app-version", (): string => {
    try {
      return app.getVersion();
    } catch (error) {
      console.error("Failed to get app version:", error);
      return "unknown";
    }
  });

  // Dialog handlers
  ipcMain.handle(
    "show-message-box",
    async (event: IpcMainInvokeEvent, options: MessageBoxOptions) => {
      try {
        const mainWindow = getMainWindow();
        if (!mainWindow) return null;

        const result = await dialog.showMessageBox(mainWindow, options);
        return result;
      } catch (error) {
        console.error("Error showing message box:", error);
        return null;
      }
    }
  );

  ipcMain.handle(
    "show-error-box",
    (event: IpcMainInvokeEvent, title: string, content: string): void => {
      try {
        dialog.showErrorBox(title, content);
      } catch (error) {
        console.error("Error showing error box:", error);
      }
    }
  );

  // Centralized error handler
  ipcMain.handle(
    "log-error",
    (event: IpcMainInvokeEvent, errorInfo: ErrorInfo): void => {
      console.error("Renderer Error:", errorInfo);
      // Here you could add more error handling logic like saving to a log file
    }
  );
}
