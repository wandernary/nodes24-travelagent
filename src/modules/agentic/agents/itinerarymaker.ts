import initAgentic from "../agentic";
import { ChatOpenAI } from "@langchain/openai";
import { tavilyTool } from "../tools";
import { AgentState } from "../states";
import { runAgentNode } from "../nodes";
import { RunnableConfig } from "@langchain/core/runnables";

const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_API_BASE,
    },
    modelName: "gpt-4o",
});

// Research agent and node
const itineraryMakerAgent = await initAgentic({
  llm,
  tools: [tavilyTool],
  systemMessage:
    `
    You are a chatbot specializing on making museum itineraries. 
    In your itineraries, you take account the time needed to visit each museums,
    giving feedback to other agents as to how many museums you can visit in a day,
    and ask to give the appropriate number of museums.
    If the user did not state specifically when they want to start the museum tour, you take the 
    assumption that they start when the first museum opens and stop when the last museum closed.
    If the user did not state specifically, add breaks for lunch, afternoon drinks, and provide
    sufficient time to travel between the museums.

    If there is a section with '## MAP', keep it as the last section of the message.

    `
});

export async function itineraryMakerNode(
  state: typeof AgentState.State,
  config?: RunnableConfig,
) {
  return runAgentNode({
    state: state,
    agent: itineraryMakerAgent,
    name: "ItineraryMaker",
    config,
  });
}
// You should provide accurate data for the map generator
// You provide the list of museums for the map generator, while providing the readable text

