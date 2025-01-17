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
const mapAgent = await initAgentic({
    llm,
    tools: [mapGraphTool],
    systemMessage: 
    ` 
    Using the tools provided, get the museum location points (latitude & longitude) in preparation to draw the location map. 
    Add this specific information to the previous answer under a section with '## MAP', and add it as the last section of the message.      
    `,
  });
  
export async function mapNode(state: typeof AgentState.State) {
    return runAgentNode({
      state: state,
      agent: mapAgent,
      name: "MapGenerator",
    });
  }

  // systemMessage: "Any routing you display will be visible by the user.",
  // Format this specific section as 
  // an array of object with property name, longitude, latitude. Do not add any other information apart from this array.
  // Together with the previous information, you provide a good starting point for itinerary maker.
