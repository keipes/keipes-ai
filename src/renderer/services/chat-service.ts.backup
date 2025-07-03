/**
 * Dummy chat service for testing
 */
import {
  ChatServiceInterface,
  MessageData,
} from "../../types/chat-service-interface";

class DummyChatService implements ChatServiceInterface {
  private messageHistory: MessageData[] = []; // Stores message history

  async sendMessage(message: string): Promise<string> {
    const messageData: MessageData = {
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    this.messageHistory.push(messageData); // Record the message in history
    return message + " asd "; // Echoes back the input message
  }

  clearHistory(): void {
    this.messageHistory = []; // Clears the message history
  }

  getHistory(): MessageData[] {
    return [...this.messageHistory]; // Returns a copy of the history
  }
}

export default new DummyChatService();
