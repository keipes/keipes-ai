import Anthropic from "@anthropic-ai/sdk";
import {
  ChatServiceInterface,
  MessageData,
} from "../../../types/chat-service-interface";
import logger from "../logger";
import MCPClient, { MCPServerDefinition } from "../../mcp/mcp-client";
import { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/beta/messages";

// const mcpClient = new MCPClient();

export class AnthropicChatService implements ChatServiceInterface {
  private anthropic: Anthropic;
  private messageHistory: MessageData[] = [];

  constructor(anthropic: Anthropic) {
    this.anthropic = anthropic;
  }

  async sendMessage(message: string): Promise<string | undefined> {
    const timestamp = new Date().toISOString();
    this.messageHistory.push({ text: message, sender: "user", timestamp });

    try {
      console.log("Sending message to Anthropic:", message);
      const msg: MessageCreateParamsNonStreaming & { betas?: string[] } = {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }],
        // tools: mcpClient.getTools(),
        // tool_choice: { type: "auto" },
      };
      msg.mcp_servers = [
        {
          name: "Keipes MCP",
          // description:
          //   "A client for BF2042 weapon stats. This client is used to interact with the Model Context Protocol (MCP) for AI services.",
          // version: "1.0.0",
          url: "https://imhqcvyxzw.us-west-2.awsapprunner.com/mcp",
          type: "url",
        },
      ];
      msg.betas = ["mcp-client-2025-04-04"];
      logger.info(`Sending message to Anthropic: ${JSON.stringify(msg)}`);
      const response = await this.anthropic.beta.messages.create(msg);
      console.log("Received response from Anthropic");
      console.log(JSON.stringify(response, null, 2));
      let assistantMessage = "";
      for (const content of response.content) {
        if (content.type === "text") {
          console.log("Assistant message:", content.text);
          if (assistantMessage === "") {
            assistantMessage = content.text;
          } else {
            assistantMessage += `\n${content.text}`;
          }
          this.messageHistory.push({
            text: content.text,
            sender: "ai",
            timestamp: new Date().toISOString(),
          });
        } else if (content.type === "mcp_tool_use") {
          console.log("Tool use detected:", content.name);
        } else if (content.type === "mcp_tool_result") {
          console.log("Tool result detected:", content.content);
        } else {
          console.log("Unknown content type:", content.type);
        }
      }
      if (assistantMessage !== "") {
        return assistantMessage;
      }
      return undefined;
    } catch (error) {
      console.error("Error sending message to Anthropic:", error);
      return undefined;
    }
  }

  clearHistory(): void {
    this.messageHistory = [];
  }

  getHistory(): MessageData[] {
    return this.messageHistory;
  }
}
