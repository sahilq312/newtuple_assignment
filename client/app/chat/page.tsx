"use client";

import { Suspense } from "react";
// Import packages
import { ChatPage } from "@/components/chat/chat-page";
import { useSearchParams } from "next/navigation";

// Import custom Components

function ChatContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return <ChatPage chat_id={id} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
