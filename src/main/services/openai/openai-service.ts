// this class inherits from AIServiceInterface
import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";
import { OpenAIChatService } from "./openai-chat-service";
import OpenAIImageService from "./openai-image-service";
import { ImageServiceInterface } from "../../../types/image-service-interface";

class OpenAIService implements AIServiceInterface {
  getChatService(): ChatServiceInterface {
    return {
      sendMessage: async (message: string) =>
        `${message} (processed by OpenAI Chat Service)`,
      clearHistory: () => {},
      getHistory: () => [],
    };
  }

  getImageService(): ImageServiceInterface {
    return OpenAIImageService;
  }
}

export default new OpenAIService();
