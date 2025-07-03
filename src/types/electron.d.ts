import type { ElectronAPI } from "../preload/api";
import type { MessageData } from "./chat-service-interface";

declare global {
  interface Window {
    electronAPI: ElectronAPI & {
      logError: (errorInfo: any) => Promise<void>;
      chatSendMessage: (message: string) => Promise<string>;
      chatClearHistory: () => Promise<void>;
      chatGetHistory: () => Promise<MessageData[]>;
    };
  }
}

export {};
