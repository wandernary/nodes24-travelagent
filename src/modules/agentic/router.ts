import { AIMessage } from "@langchain/core/messages";
import { AgentState } from "./states";

// Either agent can decide to end
export default function router(state: typeof AgentState.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    // The previous agent is invoking a tool
    return "call_tool";
  }
  else if (
    typeof lastMessage.content === "string" &&
    lastMessage.content.includes("FINAL ANSWER")
  ) {
    // Any agent decided the work is done
    return "end";
    // return "drawmap";
  }
  else {
    return "continue";
  }
}
// else if (
//   typeof lastMessage.content === "string" &&
//   lastMessage.content.includes("USER INPUT NEEDED")
// ) {
//   // Agent decides it need a user input / clarification
//   return "clarify";
// }
