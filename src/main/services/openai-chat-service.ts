import { OpenAIApi, Configuration } from "openai";
import {
  ChatServiceInterface,
  MessageData,
} from "../../types/chat-service-interface";

class OpenAIChatService implements ChatServiceInterface {
  private messageHistory: MessageData[] = []; // Stores message history
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  async sendMessage(message: string): Promise<string> {
    const messageData: MessageData = {
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    this.messageHistory.push(messageData); // Record the message in history

    try {
      const response = await this.openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: message,
      });

      const aiResponse = response.data.choices[0].text.trim() || "";
      const aiMessageData: MessageData = {
        text: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      this.messageHistory.push(aiMessageData); // Record the AI response in history

      return aiResponse;
    } catch (error) {
      console.error("Error communicating with OpenAI API:", error);
      throw new Error("Failed to get response from OpenAI API.");
    }
  }

  clearHistory(): void {
    this.messageHistory = []; // Clears the message history
  }

  getHistory(): MessageData[] {
    return [...this.messageHistory]; // Returns a copy of the history
  }
}

export default OpenAIChatService;
