import OpenAI from "openai";
import {
  ChatServiceInterface,
  MessageData,
} from "../../../types/chat-service-interface";

export class OpenAIChatService implements ChatServiceInterface {
  private openai: OpenAI;
  private messageHistory: MessageData[] = [];

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  async sendMessage(message: string): Promise<string | undefined> {
    const timestamp = new Date().toISOString();
    this.messageHistory.push({ text: message, sender: "user", timestamp });

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    const content = response.choices[0].message.content;
    return content === null ? undefined : content;
  }

  clearHistory(): void {
    this.messageHistory = [];
  }

  getHistory(): MessageData[] {
    return this.messageHistory;
  }
}
