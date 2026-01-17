"use client";

import { useState } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { ChatMessage } from "@/types/chat";

export const ChatPage = ({ chat_id }: { chat_id: string | null }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  async function sendMessage(prompt: string) {
    if (!prompt.trim()) return;

    setLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    // Create placeholder assistant message
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    const response = await fetch("http://localhost:8000/v1/ai/chat", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        history: [...messages, userMessage],
      }),
    });

    if (!response.body) {
      setLoading(false);
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      // Append streamed chunk to assistant message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + chunk } : m,
        ),
      );
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <ChatMessages messages={messages} />
      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
};
