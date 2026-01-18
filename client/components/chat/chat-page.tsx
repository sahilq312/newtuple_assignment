"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { ChatMessage } from "@/types/chat";

type SessionEvent = {
  sessionId: number;
};

import { useSocket } from "@/components/providers/socket-provider";

export const ChatPage = ({ chat_id }: { chat_id: string | null }) => {
  const router = useRouter();
  const sessionIdFromUrl = chat_id ? Number(chat_id) : null;
  const [localSessionId, setLocalSessionId] = useState<number | null>(null);
  const sessionId = sessionIdFromUrl ?? localSessionId;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { socket, isConnected } = useSocket();

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onToken = (data: { chunk: string; sessionId: number }) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          const updated = { ...lastMsg, content: lastMsg.content + data.chunk };
          return [...prev.slice(0, -1), updated];
        }
        return prev;
      });
    };

    const onSessionCreated = (data: { sessionId: number }) => {
      setLocalSessionId(data.sessionId);
      router.replace(`/chat?id=${data.sessionId}`);
    };

    const onCompleted = () => {
      setLoading(false);
    };

    const onError = (data: { message: string }) => {
      console.error("Chat error:", data.message);
      setLoading(false);
    };

    socket.on("chat:token", onToken);
    socket.on("session:created", onSessionCreated);
    socket.on("chat:completed", onCompleted);
    socket.on("chat:error", onError);

    return () => {
      socket.off("chat:token", onToken);
      socket.off("session:created", onSessionCreated);
      socket.off("chat:completed", onCompleted);
      socket.off("chat:error", onError);
    };
  }, [socket, router]);

  // Fetch initial history (HTTP is fine for this)
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
    if (!socket) return;

    setLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantId, role: "assistant", content: ""
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    socket.emit("chat:message", {
      prompt,
      history: [...messages, userMessage],
      sessionId,
    });
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <ChatMessages messages={messages} />
      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
};
