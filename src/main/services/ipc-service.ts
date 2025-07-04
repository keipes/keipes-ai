import {
  ipcMain,
  dialog,
  app,
  IpcMainInvokeEvent,
  MessageBoxOptions,
} from "electron";
import { getMainWindow } from "../windows/main-window";
import { storeApiKey, getApiKey, clearApiKey } from "./secret-service";
import { ChatServiceInterface } from "../../types/chat-service-interface";
import { ImageServiceInterface } from "../../types/image-service-interface";

import { ProviderProxy } from "./providerProxy";

function getChatService(): ChatServiceInterface {
  return ProviderProxy.getChatService();
}

function getImageService(): ImageServiceInterface {
  return ProviderProxy.getImageService();
}

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

  // Chat service handlers
  ipcMain.handle(
    "chat-send-message",
    async (event: IpcMainInvokeEvent, message: string) => {
      try {
        const response = await getChatService().sendMessage(message);
        return response;
      } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
      }
    }
  );

  ipcMain.handle("chat-clear-history", (): void => {
    try {
      getChatService().clearHistory();
    } catch (error) {
      console.error("Error clearing chat history:", error);
      throw error;
    }
  });

  ipcMain.handle("chat-get-history", () => {
    try {
      return getChatService().getHistory();
    } catch (error) {
      console.error("Error getting chat history:", error);
      throw error;
    }
  });

  // Image service handlers
  ipcMain.handle(
    "image-generate",
    async (event: IpcMainInvokeEvent, prompt: string, provider: string) => {
      try {
        const imageData = await getImageService().generateImage(
          prompt,
          provider
        );
        return imageData;
      } catch (error) {
        console.error("Error generating image:", error);
        throw error;
      }
    }
  );

  // API key storage handlers
  ipcMain.handle(
    "store-api-key",
    (event: IpcMainInvokeEvent, provider: string, key: string): boolean => {
      storeApiKey(provider, key);
      return true;
    }
  );

  ipcMain.handle(
    "get-api-key",
    (event: IpcMainInvokeEvent, provider: string): string | null => {
      return getApiKey(provider);
    }
  );

  ipcMain.handle(
    "clear-api-key",
    (event: IpcMainInvokeEvent, provider: string): boolean => {
      return clearApiKey(provider);
    }
  );

  // Provider and model management
  ipcMain.handle(
    "set-provider",
    (event: IpcMainInvokeEvent, provider: string): void => {
      ProviderProxy.setProvider(provider);
    }
  );

  ipcMain.handle("get-provider-name", (event: IpcMainInvokeEvent): string => {
    return ProviderProxy.getProviderName();
  });
}
