"use client";

// Import packages
import { ChatPage } from "@/components/chat/chat-page";
import { useSearchParams } from "next/navigation";
// Import custom Components

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return <ChatPage chat_id={id} />;
}
