class ConfigService {
  private store: any;

  constructor() {
    this.initStore();
  }

  private async initStore() {
    const { default: Store } = await import("electron-store");
    this.store = new Store();
  }

  async setProvider(provider: string): Promise<void> {
    if (!this.store) await this.initStore();
    this.store.set("provider", provider);
  }

  async getProvider(): Promise<string> {
    if (!this.store) await this.initStore();
    return (this.store.get("provider") as string) || "openai";
  }
}

export const Config = new ConfigService();
