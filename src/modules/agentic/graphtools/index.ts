import initCypherRetrievalChain from "./cypher/cypher-retrieval.chain";
// revert version is at agent/tools
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { initGraph } from "../../graph";

// Neo4j Graph
const graph = await initGraph();

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE,
  },
});

/* if you need to test what's in the database
const response = await chain.invoke({
  query: "Which museums are in Mitte?",
});
console.log(response);
*/
const cypherChain = await initCypherRetrievalChain(llm, graph);

export const mapGraphTool = new DynamicStructuredTool({
  name: "graph-cypher-chain",
  description: "cypher tool to get information from the database",
  schema: z.object({
    question: z.string().describe("the re-phrased question")
  }),
  func: async (input, _runManager, config) => {
    const newInput = { rephrasedQuestion: input.question };
    return cypherChain.invoke(newInput, config);
  }
});
