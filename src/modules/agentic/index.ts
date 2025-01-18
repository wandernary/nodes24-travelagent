import { HumanMessage } from "@langchain/core/messages";
// for the calling of langgraph
import { END, START, StateGraph } from "@langchain/langgraph";

// test run
import { museumExpertNode } from "./agents/museumexpert";
import { toolNode } from "./tools";
import { mapNode } from "./agents/map";
import router from "./router";

import { AgentState } from "./states";
import { itineraryMakerNode } from "./agents/itinerarymaker";
import { nearbyPlacesNode } from "./agents/nearbyplaces";

export type AnyList = Array<any>;

export type MapRecResult = {
  content: string;
  sender: string;
  mapData: AnyList;
  history: AnyList;
};

// tag::call[]
export async function call(input: string, sessionId: string): Promise<MapRecResult> {
  // 1. Create the graph
  const workflow = new StateGraph(AgentState)

    // 2. Add the nodes; these will do the work
    .addNode("MuseumExpert", museumExpertNode)
    .addNode("ItineraryMaker", itineraryMakerNode)
    .addNode("MapGenerator", mapNode)
    .addNode("NearbyPlaces", nearbyPlacesNode)
    .addNode("call_tool", toolNode);

  // 3. Define the edges. We will define both regular and conditional ones
  // After a worker completes, report to supervisor
  workflow.addConditionalEdges("MuseumExpert", router, {
    continue: "NearbyPlaces",
    call_tool: "call_tool",
    end: END,
  });

  workflow.addConditionalEdges("NearbyPlaces", router, {
    continue: "ItineraryMaker",
    call_tool: "call_tool",
    end: END,
  });

  workflow.addConditionalEdges("ItineraryMaker", router, {
    continue: "MapGenerator",
    call_tool: "call_tool",
    end: END,
  });

  workflow.addConditionalEdges("MapGenerator", router, {
    continue: "MuseumExpert",
    call_tool: "call_tool",
    end: END,
  });

  workflow.addConditionalEdges(
    "call_tool",
    // Each agent node updates the 'sender' field
    // the tool calling node does not, meaning
    // this edge will route back to the original agent
    // who invoked the tool
    (x) => x.sender,
    {
      ItineraryMaker: "ItineraryMaker",
      MuseumExpert: "MuseumExpert",
      NearbyPlaces: "NearbyPlaces",
      MapGenerator: "MapGenerator",
    },
  );

  workflow.addEdge(START, "MuseumExpert");
  const graph = workflow.compile();

  const streamResults = await graph.stream(
    {
      messages: [
        new HumanMessage(input),
      ],
    },
    { recursionLimit: 30 }
  );

  const result: AnyList = [];
  var i = 0;
  var finalResult: MapRecResult = { content: '', sender: '', mapData: [], history: [] };

  try {
    for await (const output of await streamResults) {
      console.log(i, "----");

      if (!output?.__end__) {
        if (output && Object.keys(output).length > 0) {
          console.log("output :", output);
          result.push(output);
          i++;
          const msgs = result[i - 1].ItineraryMaker?.messages || result[i - 1].MuseumExpert?.messages || result[i - 1].NearbyPlaces?.messages || result[i - 1].MapGenerator?.messages;
          if (msgs && msgs[0].content.includes("FINAL ANSWER")) {
            console.log("This is my final answer. I'm done.")
            break;
          }
        }

        console.log("----", i);
      }
    }

    finalResult.history = result;

    if (i > 0) {
      finalResult.mapData = result[i - 1];
      const msgs = result[i - 1].ItineraryMaker?.messages || result[i - 1].MuseumExpert?.messages || result[i - 1].NearbyPlaces?.messages || result[i - 1].MapGenerator?.messages;
      console.log(msgs[0].content);

      finalResult.sender = result[i - 1].ItineraryMaker?.sender || result[i - 1].MuseumExpert?.sender || result[i - 1].NearbyPlaces?.messages || result[i - 1].MapGenerator?.messages;

      // NOTE: Need to investigate why the content works like this
      finalResult.content = msgs[0].content;
    }

  } catch (e) {
    console.error("error at index agentic stream", e);
  }

  return finalResult;
}
