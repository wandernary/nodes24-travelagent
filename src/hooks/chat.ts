import { useEffect, useRef, useState } from "react";

export type Message = {
  role: "human" | "ai";
  content: any;
};

export default function useChat() {
  const [thinking, setThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        process.env.NEXT_PUBLIC_CHATBOT_GREETING || "What kind of museum itinerary would you like to do today?",
    },
  ]);
  const container = useRef<HTMLDivElement>(null);

  const generateResponse = async (message: string): Promise<void> => {
    // Append human message
    messages.push({ role: "human", content: message });

    // Set thinking to true
    setThinking(true);

    try {
      // Send POST message to the API
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });

      // Append the API message to the state
      const json = await response.json();

      // json here needs to be more consistent with the naming. 
      // the content that was sent is MapRecResult (index.ts agentic), and yet you can
      // add anything or take any value from this json (which is dangerous)
      // Note: Remember to restart server when making changes to the hook
      messages.push({ role: "ai", content: json.content });

      setMessages(messages);
    } catch (e) {
      console.error("error at chat hook", e);
    } finally {
      setThinking(false);
    }
  };

  // Scroll latest message into view
  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, [thinking, messages]);

  return {
    thinking,
    messages,
    container,
    generateResponse,
  };
}
