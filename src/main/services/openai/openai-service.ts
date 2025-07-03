// this class inherits from AIServiceInterface
import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";
import { OpenAIChatService } from "./openai-chat-service";

export class OpenAIService implements AIServiceInterface {
  getChatService(): ChatServiceInterface {
    return new OpenAIChatService("your-api-key");
  }
}
