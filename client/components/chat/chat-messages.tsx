"use client";

import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatMessage } from "./chat-message";

import { useRef, useEffect } from "react";

export const ChatMessages = ({ messages }: { messages: ChatMessageType[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {messages
          //.filter((m) => m.role !== "system")
          .map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              sender={message.role}
              timestamp={message.createdAt}
            />
          ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};
