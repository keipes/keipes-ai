/**
 * Chat service for the main process
 */
import {
  ChatServiceInterface,
  MessageData,
} from "../../types/chat-service-interface";

class ChatService implements ChatServiceInterface {
  private messageHistory: MessageData[] = []; // Stores message history

  async sendMessage(message: string): Promise<string> {
    const messageData: MessageData = {
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    this.messageHistory.push(messageData); // Record the message in history

    // Create AI response
    const response = message + " (processed by main process)";
    const aiMessageData: MessageData = {
      text: response,
      sender: "ai",
      timestamp: new Date().toISOString(),
    };
    this.messageHistory.push(aiMessageData); // Record the AI response in history

    return response;
  }

  clearHistory(): void {
    this.messageHistory = []; // Clears the message history
  }

  getHistory(): MessageData[] {
    return [...this.messageHistory]; // Returns a copy of the history
  }
}

export default new ChatService();
