import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { Messages } from "@anthropic-ai/sdk/resources/messages";

export const MCPServerDefinition = {
  name: "Keipes MCP",
  description:
    "A client for BF2042 weapon stats. This client is used to interact with the Model Context Protocol (MCP) for AI services.",
  version: "1.0.0",
  baseUrl: "http://52.24.122.97/mcp",
};

export default class MCPClient {
  private client: Client;

  private tools: Tool[] = [];
  private toolsRequestInFlight: boolean = false;

  constructor() {
    this.client = new Client(MCPServerDefinition);
    let url = new URL(MCPServerDefinition.baseUrl);
    let transport = new StreamableHTTPClientTransport(url);
    this.client
      .connect(transport)
      .then(() => {
        console.log("Connected to MCP server");
      })
      .catch((error) => {
        console.error("Failed to connect to MCP server:", error);
      });
    this.client
      .listTools()
      .then((response) => {
        console.log("Available tools:", response);
        console.log(response.tools);
        this.tools = response.tools;
        console.log("Tools loaded");
      })
      .catch((error) => {
        console.error("Error listing tools:", error);
      });
  }

  getTools(): Array<Messages.ToolUnion> {
    console.log("Show client tools");
    console.log(JSON.stringify(this));
    console.log("Tools:", this.tools);
    // return [
    //   {
    //     name: "echo",
    //     description: "Echo the input text back",
    //     input_schema: {},
    //   },
    // ];

    let new_tools = [];
    for (let tool of this.tools) {
      new_tools.push({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      });
    }
    // this.tools.push({
    //   type: "web_search_20250305",
    //   name: "web_search",
    //   max_uses: 5,
    // });
    return new_tools;
  }
}
