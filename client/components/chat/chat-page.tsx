"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { ChatMessage } from "@/types/chat";

type SessionEvent = {
  sessionId: number;
};

export const ChatPage = ({ chat_id }: { chat_id: string | null }) => {
  const router = useRouter();

  /* ===========================
     SESSION STATE (CORRECT)
  =========================== */

  // Session derived from URL (source of truth)
  const sessionIdFromUrl = chat_id ? Number(chat_id) : null;

  // Session created lazily by backend
  const [localSessionId, setLocalSessionId] = useState<number | null>(null);

  // Effective session id
  const sessionId = sessionIdFromUrl ?? localSessionId;

  /* ===========================
          CHAT STATE
  =========================== */

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===========================
      LOAD EXISTING CHAT
  =========================== */

  useEffect(() => {
    if (!sessionIdFromUrl) return;

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/v1/ai/chat/${sessionIdFromUrl}`,
          { credentials: "include" },
        );

        if (!res.ok) return;

        const data = await res.json();

        setMessages(
          data.messages.map((m: any) => ({
            id: String(m.id),
            role: m.role,
            content: m.content,
          })),
        );
      } catch (err) {
        console.error("Failed to load chat session", err);
      }
    })();
  }, [sessionIdFromUrl]);

  async function sendMessage(prompt: string) {
    if (!prompt.trim()) return;

    setLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

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
        sessionId,
      }),
    });

    if (!response.body) {
      setLoading(false);
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const frames = buffer.split("\n\n");
      buffer = frames.pop() || "";

      for (const frame of frames) {
        if (frame.startsWith("event: session")) {
          const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));

          if (!dataLine) continue;

          const payload: SessionEvent = JSON.parse(
            dataLine.replace("data: ", ""),
          );

          setLocalSessionId(payload.sessionId);

          // Update URL without reload
          router.replace(`/chat?id=${payload.sessionId}`);
          continue;
        }

        if (frame.startsWith("data:")) {
          const chunk = frame.replace("data: ", "");

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        }
      }
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
