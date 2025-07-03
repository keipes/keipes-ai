import {
  ipcMain,
  dialog,
  app,
  IpcMainInvokeEvent,
  MessageBoxOptions,
} from "electron";
import { getMainWindow } from "../windows/main-window";
import dummyAIService from "./dummy/dummy-ai-service";
import openAIService from "./openai/openai-service";
import { AIServiceInterface } from "../../types/ai-service-interface";

const useDummyService = true; // Toggle between services
const aiService: AIServiceInterface = useDummyService
  ? dummyAIService
  : openAIService;

const chatService = aiService.getChatService();
const imageService = aiService.getImageService();

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
        const response = await chatService.sendMessage(message);
        return response;
      } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
      }
    }
  );

  ipcMain.handle("chat-clear-history", (): void => {
    try {
      chatService.clearHistory();
    } catch (error) {
      console.error("Error clearing chat history:", error);
      throw error;
    }
  });

  ipcMain.handle("chat-get-history", () => {
    try {
      return chatService.getHistory();
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
        const imageData = await imageService.generateImage(prompt, provider);
        return imageData;
      } catch (error) {
        console.error("Error generating image:", error);
        throw error;
      }
    }
  );
}
