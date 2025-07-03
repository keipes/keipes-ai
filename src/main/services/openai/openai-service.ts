// this class inherits from AIServiceInterface
import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";
import { OpenAIChatService } from "./openai-chat-service";
import OpenAIImageService from "./openai-image-service";
import { ImageServiceInterface } from "../../../types/image-service-interface";
import OpenAI from "openai";
import logger from "../logger";

class OpenAIService implements AIServiceInterface {
  // openapi client
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || "default-api-key"; // Replace with secure key retrieval
    this.openai = new OpenAI({ apiKey });
    logger.info("OpenAIService initialized with key: " + apiKey);
  }

  getChatService(): ChatServiceInterface {
    return new OpenAIChatService(this.openai);
  }

  getImageService(): ImageServiceInterface {
    return OpenAIImageService;
  }
}

export default OpenAIService;
