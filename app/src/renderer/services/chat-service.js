/**
 * Chat service for handling AI interactions
 */
import { CONFIG } from "../../shared/config.js";
import { ErrorHandler, AppError, ErrorCodes } from "../utils/error-handling.js";

class ChatService {
  constructor() {
    this.isGenerating = false;
    this.messageHistory = [];
  }

  async sendMessage(message) {
    if (this.isGenerating) return;

    this.isGenerating = true;
    try {
      this.addMessage(message, "user");
      const response = await this.generateResponse(message);
      this.addMessage(response, "ai");
      return response;
    } catch (error) {
      await ErrorHandler.handleError(
        new AppError("Failed to send message", ErrorCodes.API_ERROR, {
          originalMessage: message,
        }),
        true
      );
    } finally {
      this.isGenerating = false;
    }
  }

  addMessage(message, sender) {
    const messageData = {
      text: message,
      sender,
      timestamp: new Date().toISOString(),
    };

    this.messageHistory.push(messageData);
    this.displayMessage(messageData);
  }

  displayMessage(messageData) {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${messageData.sender}`;
    messageDiv.textContent = messageData.text;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async generateResponse(message) {
    const response = await fetch(
      `${CONFIG.BACKEND_URL}${CONFIG.API_ENDPOINTS.CHAT}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AppError(
        error.error || "Failed to get AI response",
        ErrorCodes.API_ERROR
      );
    }

    const data = await response.json();
    return data.response;
  }

  clearHistory() {
    this.messageHistory = [];
    const chatMessages = document.getElementById("chatMessages");
    if (chatMessages) {
      const welcomeMessage = chatMessages.querySelector(".welcome-message");
      chatMessages.innerHTML = "";
      if (welcomeMessage) {
        chatMessages.appendChild(welcomeMessage);
      }
    }
  }
}

export default new ChatService();
