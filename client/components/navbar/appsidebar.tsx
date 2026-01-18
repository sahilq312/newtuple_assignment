"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getChatHistory } from "@/lib/api";
import { HelpCircle, MessageSquare, Plus, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { deleteChatSession } from "@/lib/api";

type ChatSession = {
  id: number;
  title?: string;
  createdAt: string;
};

export function AppSidebar() {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null)

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

  const handleDeleteChat = async (id: number) => {
    try {
      await deleteChatSession(id);
      setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    } catch (err) {
      console.error("Failed to delete chat", err);
      // Optional: Add toast notification here
    }
  };

  return (
    <Sidebar>
      {/* Header with New Chat Button */}
      <SidebarHeader>
        <Link href="/chat" className="w-full">
          <Button className="w-full gap-2">
            <Plus className="size-4" />
            New Chat
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Chat History Content */}
      <SidebarContent>
        {loading && (
          <SidebarGroup>
            <p className="text-sm text-muted-foreground">Loading chats…</p>
          </SidebarGroup>
        )}

        {error && (
          <SidebarGroup>
            <p className="text-sm text-destructive">{error}</p>
          </SidebarGroup>
        )}

        {!loading && !error && chatHistory.length === 0 && (
          <SidebarGroup>
            <p className="text-sm text-muted-foreground">No chats yet</p>
          </SidebarGroup>
        )}

        {!loading && !error && chatHistory.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Chat History</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatHistory.map((chat) => (
                  <SidebarMenuItem
                    key={chat.id}
                    onMouseEnter={() => setHoveredId(chat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="relative group">
                      <SidebarMenuButton className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <MessageSquare className="size-4 shrink-0" />
                          <span className="truncate text-sm">
                            {chat.title ?? `Chat #${chat.id}`}
                          </span>
                        </div>
                        {hoveredId === chat.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                            className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors shrink-0"
                            title="Delete chat"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full gap-2">
                <Settings className="size-4" />
                <span>Settings</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full gap-2">
                <HelpCircle className="size-4" />
                <span>Help & FAQ</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
