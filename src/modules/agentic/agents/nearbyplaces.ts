import initAgentic from "../agentic";
import { ChatOpenAI } from "@langchain/openai";
import { mapGraphTool } from "../graphtools";
import { AgentState } from "../states";
import { runAgentNode } from "../nodes";

const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: process.env.OPENAI_API_BASE,
    },
  });

// Chart Generator
const nearbyPlacesAgent = await initAgentic({
    llm,
    tools: [mapGraphTool],
    systemMessage: 
    ` 
    Using the tool provided, you should check if the location of the museums are near to each other.
    If the locations aren't near, recommend museums that are near so the next agent can make new itinerary.
    
    If there is a section with '## MAP', keep it as the last section of the message.

    `,
  });
  
export async function nearbyPlacesNode(state: typeof AgentState.State) {
    return runAgentNode({
      state: state,
      agent: nearbyPlacesAgent,
      name: "NearbyPlaces",
    });
  }

  // systemMessage: "Any routing you display will be visible by the user.",
  // If you can, then provide feedback to the ItineraryMaker in regards of which museums in the list are near to each other 
  // If the result returns no value, say that you don't know, and pass the previous question to the next agent.

