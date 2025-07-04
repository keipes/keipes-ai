import Anthropic from "@anthropic-ai/sdk";
import {
  ChatServiceInterface,
  MessageData,
} from "../../../types/chat-service-interface";

export class AnthropicChatService implements ChatServiceInterface {
  private anthropic: Anthropic;
  private messageHistory: MessageData[] = [];

  constructor(anthropic: Anthropic) {
    this.anthropic = anthropic;
  }

  async sendMessage(message: string): Promise<string | undefined> {
    const timestamp = new Date().toISOString();
    this.messageHistory.push({ text: message, sender: "user", timestamp });

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }],
      });

      const content = response.content[0];
      if (content.type === "text") {
        const assistantMessage = content.text;
        this.messageHistory.push({
          text: assistantMessage,
          sender: "ai",
          timestamp: new Date().toISOString(),
        });
        return assistantMessage;
      }
      return undefined;
    } catch (error) {
      console.error("Error sending message to Anthropic:", error);
      return undefined;
    }
  }

  clearHistory(): void {
    this.messageHistory = [];
  }

  getHistory(): MessageData[] {
    return this.messageHistory;
  }
}
