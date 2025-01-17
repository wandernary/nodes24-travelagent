import { parse } from "marked";
import { Message as MessageType } from "@/hooks/chat";

function fixMarkdown(message: MessageType): string {
  if (message.content) {
    return parse(message.content, {async: false}).replace(
      '<a href="',
      '<a target="_blank" href="'
    );  
  }
  else {
    return "return from fixmarkdown";
  }
}

export default function Message({ message }: { message: MessageType }) {
  const align = message.role == "ai" ? "justify-start" : "justify-end";
  const no_rounding =
    message.role == "ai" ? "rounded-bl-none" : "rounded-br-none";
  const background = message.role == "ai" ? "blue" : "slate";

  return (
    <div className={`w-full flex flex-row ${align}`}>
      <span className="bg-blue-100"></span>
      <div className="flex flex-col space-y-2 text-sm mx-2 max-w-[60%] order-2 items-start">
        <div className={`bg-${background}-100 p-4 rounded-xl ${no_rounding}`}>
          <div
            dangerouslySetInnerHTML={{
              __html: fixMarkdown(message),
            }}
          />
        </div>
      </div>
    </div>
  );
}
