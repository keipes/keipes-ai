import { ChatServiceInterface } from "./chat-service-interface";

export interface AIServiceInterface {
  getChatService(): ChatServiceInterface;
}
