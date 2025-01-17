import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

// tag::function[]
export default async function initCypherGenerationChain(
  graph: Neo4jGraph,
  llm: BaseLanguageModel
) {
  // tag::prompt[]
  // Create Prompt Template
  const cypherPrompt = PromptTemplate.fromTemplate(`
    You are a Neo4j Developer translating user questions into Cypher to answer questions
    about museums in Berlin and provide routing.
    Convert the user's question into a Cypher statement based on the schema.

    You must:
    * Only use the nodes, relationships and properties mentioned in the schema.
    * When required, \`IS NOT NULL\` to check for property existence, and not the exists() function.
    * Never create new nodes, relationship, or property.
    * Use the \`elementId()\` function to return the unique identifier for a node or relationship as \`_id\`.
      For example:
      \`\`\`
      MATCH (m:Museum)-[:LOCATED_IN]->(c:Municipality)
      WHERE m.name = 'Neues Museum'
      RETURN m.name AS name, elementId(m) AS _id, c.name AS municipal_name
      \`\`\`
    * Include extra information about the nodes that may help an LLM provide a more informative answer,
      for example the website and the location.
    * For museums, use the MATCH (m:Museum)-[:HAS_WEBSITE]->(c:Website) query to get c.uri property to return a source URL.
      For example: \`'https://www.smb.museum/museen-einrichtungen/neues-museum/home/'+ c.uri AS source\`.
    * Limit the maximum number of results to 10.
    * Respond with only a Cypher statement.  No preamble.


    Example Question: 
    1. Which museums are located in Berlin
    Example Cypher:
    \`\`\`
    MATCH (m:Museum)-[rel:LOCATED_IN]->(c:Municipal) WHERE c.name = 'Berlin'
    RETURN m.name AS museumname
    \`\`\`

    2. What is the location (for drawing of a map) of Altes Museum?
    Example Cypher:
    \`\`\`
    MATCH (m:Museum) WHERE m.name = "Altes Museum" RETURN m.location_point AS location_point
    \`\`\`

    3. Which museums are located nearby Altes Museum?
    Example Cypher:
    \`\`\`
    MATCH (m:Museum)-[:NEAR]-(m2:Museum) WHERE m.name = "Altes Museum" RETURN m2
    \`\`\`

    Schema:
    {schema}

    Question:
    {question}
  `);
  // end::prompt[]

  // tag::sequence[]
  // tag::startsequence[]
  // Create the runnable sequence
  return RunnableSequence.from<string, string>([
    // end::startsequence[]
    // tag::assign[]
    {
      // Take the input and assign it to the question key
      question: new RunnablePassthrough(),
      // Get the schema
      schema: () => graph.getSchema(),
    },
    // end::assign[]
    // tag::rest[]
    cypherPrompt,
    llm,
    new StringOutputParser(),
    // end::rest[]
    // tag::endsequence[]
  ]);
  // end::endsequence[]
  // end::sequence[]
}
// end::function[]
