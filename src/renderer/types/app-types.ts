export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export interface Settings {
  geminiApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  imageProvider: string;
  darkMode: boolean;
  autoSave: boolean;
}
