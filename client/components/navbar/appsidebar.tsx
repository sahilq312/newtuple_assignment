"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getChatHistory } from "@/lib/api";

type ChatSession = {
  id: number;
  title?: string;
  createdAt: string;
};

export function AppSidebar() {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getChatHistory();
        setChatHistory(res.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load chat history",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Sidebar>
      <SidebarHeader />

      <SidebarContent>
        {loading && (
          <SidebarGroup>
            <p className="text-sm text-muted-foreground">Loading chats…</p>
          </SidebarGroup>
        )}

        {error && (
          <SidebarGroup>
            <p className="text-sm text-red-500">{error}</p>
          </SidebarGroup>
        )}

        {!loading && !error && chatHistory.length === 0 && (
          <SidebarGroup>
            <p className="text-sm text-muted-foreground">No chats yet</p>
          </SidebarGroup>
        )}

        {!loading &&
          !error &&
          chatHistory.map((chat) => (
            <SidebarGroup key={chat.id}>
              <button className="w-full text-left text-sm hover:bg-muted rounded px-2 py-1">
                {chat.title ?? `Chat #${chat.id}`}
              </button>
            </SidebarGroup>
          ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
