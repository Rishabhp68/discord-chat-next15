"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initSocket = async () => {
      try {
        await fetch("/api/socket/io"); // ✅ make sure server is initialized

        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
          path: "/api/socket/io",
          transports: ["websocket"],
          withCredentials: true,
        });

        socketInstance.on("connect", () => {
          setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
          setIsConnected(false);
        });

        setSocket(socketInstance);
      } catch (err) {
        console.error("Failed to init socket:", err);
      }
    };

    initSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
