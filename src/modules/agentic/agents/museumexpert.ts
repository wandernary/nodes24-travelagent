import initAgentic from "../agentic";
import { ChatOpenAI } from "@langchain/openai";
import { tavilyTool } from "../tools";
import { AgentState } from "../states";
import { runAgentNode } from "../nodes";
import { RunnableConfig } from "@langchain/core/runnables";

const llm = new ChatOpenAI({ modelName: "gpt-4o" });

// Research agent and node
const museumExpertAgent = await initAgentic({
  llm,
  tools: [tavilyTool],
  systemMessage:
`You specialize on Berlin museums. 
You know about the museum specialties and you can recommend them based on 
what the user wants to see in Berlin. 

If the user did not give enough information, make this assumptions:
- The museums are in Berlin
- Recommend a general / popular museum

If there is a section with '## MAP', keep it as the last section of the message.
`
});

export async function museumExpertNode(
  state: typeof AgentState.State,
  config?: RunnableConfig,
) {
  return runAgentNode({
    state: state,
    agent: museumExpertAgent,
    name: "MuseumExpert",
    config,
  });
}

// "You should provide accurate museum data for the next agent to use.",
// "You should provide accurate data for the map generator to use.",

// `You specialize on Berlin museums. 
// You know about the museum specialties and you can recommend them based on 
// what the user wants to see in Berlin. 
// You provide a good starting point for the itinerary maker.
// `
// Respond to any question not related to Berlin museums by apologizing and
// tell them that your knowledge currently limited to Berlin museums and whether 
// they would want to know something about Berlin museums instead.
