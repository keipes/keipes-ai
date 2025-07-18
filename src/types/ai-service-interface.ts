import { ChatServiceInterface } from "./chat-service-interface";
import { ImageServiceInterface } from "./image-service-interface";

export interface AIServiceInterface {
  getProviderName(): string;
  getChatService(): ChatServiceInterface;
  getImageService(): ImageServiceInterface;
  listModels(): Promise<string[]>; // Optional method to list available models
}
