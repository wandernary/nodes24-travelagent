import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// tag::interface[]
export type CypherEvaluationChainInput = {
  question: string;
  cypher: string;
  schema: string;
  errors: string[] | string | undefined;
};
// end::interface[]

// tag::output[]
export type CypherEvaluationChainOutput = {
  cypher: string;
  errors: string[];
};
// end::output[]

// tag::function[]
export default async function initCypherEvaluationChain(
  llm: BaseLanguageModel
) {
  // tag::prompt[]
  // Prompt template
  const prompt = PromptTemplate.fromTemplate(`
    You are an expert Neo4j Developer evaluating a Cypher statement written by an AI.

    Check that the cypher statement provided below against the database schema to check that
    the statement will answer the user's question.
    Fix any errors where possible.

    The query must:
    * Only use the nodes, relationships and properties mentioned in the schema.
    * Assign a variable to nodes or relationships when intending to access their properties.
    * Use \`IS NOT NULL\` to check for property existence.

    Respond with a JSON object with "cypher" and "errors" keys.
      * "cypher" - the corrected cypher statement
      * "corrected" - a boolean
      * "errors" - A list of uncorrectable errors.  For example, if a label,
          relationship type or property does not exist in the schema.
          Provide a hint to the correct element where possible.

    Fixable Example #1:
    * cypher:
        MATCH (museum1:Museum)-[r:CONNECTED_TO]-(museum2:Museum) 
        WHERE museum1.name = 'Altes Museum' 
        RETURN museum1, museum2    
    * response:
        MATCH (museum1:Museum)-[r:NEAR]-(museum2:Museum) 
        WHERE museum1.name = 'Altes Museum' 
        RETURN museum1, museum2    

    Fixable Example #1:
    * cypher:
        MATCH (m3:Museum)-[:LOCATED_IN]->(l3:Location) 
        WHERE m3.name = 'Museum für Naturkunde'
        RETURN l3
    * response:
        MATCH (m3:Museum)-[:LOCATED_IN]->(l3:Municipal)
        WHERE m3.name = 'Museum für Naturkunde'
        RETURN l3

    Schema:
    {schema}

    Question:
    {question}

    Cypher Statement:
    {cypher}

    {errors}
  `);
  // end::prompt[]

  // tag::runnable[]
  return RunnableSequence.from<
    CypherEvaluationChainInput,
    CypherEvaluationChainOutput
  >([
    // tag::assign[]
    RunnablePassthrough.assign({
      // Convert errors into an LLM-friendly list
      errors: ({ errors }) => {
        console.error(errors)
        if (
          errors === undefined ||
          (Array.isArray(errors) && errors.length === 0)
        ) {
          return "";
        }

        return `Errors: * ${
          Array.isArray(errors) ? errors?.join("\n* ") : errors
        }`;
      },

    }),
    // end::assign[]
    // tag::rest[]
    prompt,
    llm,
    new JsonOutputParser<CypherEvaluationChainOutput>(),
    // end::rest[]
  ]);
  // end::runnable[]
}
// end::function[]
