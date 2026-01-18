"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io("http://localhost:8000", {
            withCredentials: true,
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
            console.log("Socket connected");
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
            console.log("Socket disconnected");
        });

        // Debugging connection errors
        socketInstance.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
