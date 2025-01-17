import { ToolNode } from "@langchain/langgraph/prebuilt";

// tavily search
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { AgentState } from "./states";
import { mapGraphTool } from "./graphtools/index";

// agentic init tools
// tavily tools (just one line, so I added it here instead of putting it in one file)
export const tavilyTool = new TavilySearchResults();

const tools = [tavilyTool, mapGraphTool];
// This runs tools in the langgraph

export const toolNode = new ToolNode<typeof AgentState.State>(tools);