export interface AIService {
  generateText(prompt: string): Promise<string>;
}
