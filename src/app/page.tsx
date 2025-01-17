"use client";

import Image from "next/image";


import Form from "@/components/form";
import Message from "@/components/message";
import Thinking from "@/components/thinking";
import useChat from "@/hooks/chat";
import React from "react";


export default function Home() {

  const { messages, thinking, container, generateResponse } = useChat();

  const thinkingText = `🤔 ${
    process.env.NEXT_PUBLIC_CHATBOT_NAME || "Chatbot"
  } is thinking...`;
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/wandernary.svg"
          alt="Wandernary Logo"
          width={300}
          height={37}
          priority
        />
      </div>

      <div
        className="n- flex n- flex-col n- h-screen n-"
        style={{ height: "100vh" }}
      >
        <div className="p-4  bg-custom-blue rounded-lg flex flex-row justify-between">
          <h1 className="text-white">
            <span className="font-bold">
              {process.env.NEXT_PUBLIC_CHATBOT_NAME || "Chatbot"} -
            </span>
            <span className="text-custom-blue">
              {" "}
              {process.env.NEXT_PUBLIC_CHATBOT_DESCRIPTION}
            </span>
          </h1>
        </div>

        <div
          ref={container}
          className="
            flex flex-grow flex-col space-y-4 p-3 overflow-y-auto
            scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messages.map((m, i) => {
            return <Message key={i} message={m} />;
          })}

          {thinking && <Thinking />}
        </div>

        <Form
          messages={messages}
          thinking={thinking}
          container={container}
          onSubmit={(m) => generateResponse(m)}
        />

        <div className="flex flex-row justify-between b-slate-200 px-4 pb-4 bg-slate-100 text-xs text-slate-600">
          <div className="animate-pulse">{thinking ? thinkingText : " "}</div>
          <div>
            Powered by
            <a href="https://neo4j.com" target="_blank" className="font-bold">
              {" "}
              Neo4j
            </a>
          </div>
        </div>
      </div>

    </main>
  );
}
