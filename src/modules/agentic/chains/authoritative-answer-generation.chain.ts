import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { BaseLanguageModel } from "@langchain/core/language_models/base";

// tag::interface[]
export type GenerateAuthoritativeAnswerInput = {
  question: string;
  context: string | undefined;
};
// end::interface[]

// tag::function[]
export default function initGenerateAuthoritativeAnswerChain(
  llm: BaseLanguageModel
): RunnableSequence<GenerateAuthoritativeAnswerInput, string> {
  // Create prompt
  const answerQuestionPrompt = PromptTemplate.fromTemplate(`
    Use the following context to answer the following question.
    The context is provided by an authoritative source, you must never doubt
    it or attempt to use your pre-trained knowledge to correct the answer.
  
    Make the answer sound like it is a response to the question.
    Do not mention that you have based your response on the context.
  
    Here is an example:
  
    Question: Which museums are near to the Altes Museum?
    Context: ['museum1': 'Altes Museum', 'museum2': 'Neues Museum', (museum1)-[:NEAR]->(museum2)]
    Response: Neues Museum is nearby Altes Museum
  
    If no context is provided, use this context instead:
    * Use only the museums that exists in the database.
    * If the museum questioned is in English, you might need to get the German name to query it into the database
  
    Question:
    {question}
  
    Context:
    {context}
  `);

  // Return RunnableSequence
  return RunnableSequence.from<GenerateAuthoritativeAnswerInput, string>([
    RunnablePassthrough.assign({
      context: ({ context }) =>
        context == undefined || context === "" ? "I don't know" : context,
    }),
    answerQuestionPrompt,
    llm,
    new StringOutputParser(),
  ]);
}
// end::function[]
