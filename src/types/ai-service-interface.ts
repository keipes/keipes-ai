import { ChatServiceInterface } from "./chat-service-interface";
import { ImageServiceInterface } from "./image-service-interface";

export interface AIServiceInterface {
  getChatService(): ChatServiceInterface;
  getImageService(): ImageServiceInterface;
}
