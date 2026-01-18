"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (url: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(url, {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [url]);

    return { socket, isConnected };
};
