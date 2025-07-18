import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";
import { ImageServiceInterface } from "../../../types/image-service-interface";

interface AIResponse {
  text: string;
  timestamp: string;
}

export default class DummyAIService implements AIServiceInterface {
  listModels(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  async generateResponse(prompt: string): Promise<AIResponse> {
    return {
      text: `${prompt} (processed by DummyAIService)`,
      timestamp: new Date().toISOString(),
    };
  }

  getProviderName(): string {
    return "dummy";
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
