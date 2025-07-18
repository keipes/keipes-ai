import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

/**
 * Simple HTTP transport for MCP communication
 */
export class HTTPClientTransport implements Transport {
  private url: URL;
  private isStarted = false;

  public onclose?: () => void;
  public onerror?: (error: Error) => void;
  public onmessage?: (message: JSONRPCMessage) => void;

  constructor(url: URL) {
    this.url = url;
  }

  async start(): Promise<void> {
    if (this.isStarted) {
      throw new Error("HTTPClientTransport already started!");
    }
    this.isStarted = true;
    // For HTTP transport, we don't maintain a persistent connection
    console.log(`HTTP transport ready for ${this.url.href}`);
  }

  async close(): Promise<void> {
    this.isStarted = false;
    this.onclose?.();
  }

  async send(message: JSONRPCMessage): Promise<void> {
    if (!this.isStarted) {
      throw new Error("Not connected");
    }

    try {
      const response = await fetch(this.url.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = (await response.json()) as JSONRPCMessage;

      // Handle the response
      if (this.onmessage) {
        this.onmessage(responseData);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("HTTP transport error:", err);
      this.onerror?.(err);
      throw err;
    }
  }
}
