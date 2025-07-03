import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";

interface AIResponse {
  text: string;
  timestamp: string;
}

class DummyAIService implements AIServiceInterface {
  async generateResponse(prompt: string): Promise<AIResponse> {
    return {
      text: `${prompt} (processed by DummyAIService)`,
      timestamp: new Date().toISOString(),
    };
  }

  getChatService(): ChatServiceInterface {
    return {
      sendMessage: async (message: string) =>
        `${message} (processed by Dummy Chat Service)`,
      clearHistory: () => {},
      getHistory: () => [],
    };
  }
}

export default new DummyAIService();
