"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";

export const SocketIndicator = () => {
    // Assuming the server acts as the websocket server on port 8000
    const { isConnected } = useSocket();

    return (
        <div
            className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-500",
                isConnected ? "bg-emerald-500/10" : "bg-rose-500/10"
            )}
            title={isConnected ? "Connected to server" : "Disconnected"}
        >
            <div
                className={cn(
                    "h-2.5 w-2.5 rounded-full shadow-sm transition-all duration-500",
                    isConnected
                        ? "bg-emerald-500 animate-pulse shadow-emerald-500/50"
                        : "bg-rose-500 shadow-rose-500/50"
                )}
            />
            <span className="sr-only">
                {isConnected ? "Connected" : "Disconnected"}
            </span>
        </div>
    );
};
