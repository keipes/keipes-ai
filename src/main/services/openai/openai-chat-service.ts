import OpenAI from "openai";
import {
  ChatServiceInterface,
  MessageData,
} from "../../types/chat-service-interface";

export class OpenAIChatService implements ChatServiceInterface {
  private openai: OpenAI;
  private messageHistory: MessageData[] = [];

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async sendMessage(message: string): Promise<string | undefined> {
    const timestamp = new Date().toISOString();
    this.messageHistory.push({ text: message, sender: "user", timestamp });
    // Replace with actual OpenAI API call
    return "Response from OpenAI";
  }

  clearHistory(): void {
    this.messageHistory = [];
  }

  getHistory(): MessageData[] {
    return this.messageHistory;
  }
}
