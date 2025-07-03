export interface ChatServiceInterface {
  sendMessage(message: string): Promise<string | undefined>;
  clearHistory(): void;
  getHistory(): MessageData[];
}

export interface MessageData {
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}
