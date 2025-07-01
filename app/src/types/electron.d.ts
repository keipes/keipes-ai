import type { ElectronAPI } from "../preload/api";

declare global {
  interface Window {
    electronAPI: ElectronAPI & {
      logError: (errorInfo: any) => Promise<void>;
    };
  }
}

export {};
