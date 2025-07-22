import WebSocket from "ws";

// Set WebSocket globally before importing MCP SDK
(global as any).WebSocket = WebSocket;

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { Messages } from "@anthropic-ai/sdk/resources/messages";
import { WebSocketClientTransport } from "@modelcontextprotocol/sdk/client/websocket.js";

export const MCPServerDefinition = {
  name: "Keipes MCP",
  description:
    "A client for BF2042 weapon stats. This client is used to interact with the Model Context Protocol (MCP) for AI services.",
  version: "1.0.0",
  baseUrl: "wss://imhqcvyxzw.us-west-2.awsapprunner.com/mcp",
};

export default class MCPClient {
  private client: Client;
  private tools: Tool[] = [];

  constructor() {
    this.client = new Client(MCPServerDefinition);
    const url = new URL(MCPServerDefinition.baseUrl);
    const transport = new WebSocketClientTransport(url);

    this.client
      .connect(transport)
      .then(() => {
        console.log("Connected to MCP server");
        return this.client.listTools();
      })
      .then((response) => {
        console.log("Available tools:", response);
        this.tools = response.tools;
        console.log("Tools loaded");
      })
      .catch((error) => {
        console.error("Failed to connect to MCP server:", error);
      });
  }

  getTools(): Array<Messages.ToolUnion> {
    return this.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema,
    }));
  }
}
