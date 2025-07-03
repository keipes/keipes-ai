export interface ImageData {
  image_base64: string;
  filename: string;
}

export interface ImageServiceInterface {
  generateImage(
    prompt: string,
    provider?: string
  ): Promise<ImageData | undefined>;
}
