import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";
import { ImageServiceInterface } from "../../../types/image-service-interface";

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

  getImageService(): ImageServiceInterface {
    return {
      generateImage: async (prompt: string, provider: string) => ({
        image_base64: "",
        filename: "dummy-image.png",
      }),
    };
  }
}

export default new DummyAIService();
