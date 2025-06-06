import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { create } from "zustand";
import userStore from "../store/user-store.js"; 

// --- Zustand store for socket state ---
export const useSocketStore = create((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));

// --- React Context for socket ---
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { socket, setSocket } = useSocketStore();
  const token = userStore.getState().token;

  useEffect(() => {
    if (!token) return;

    // Connect to your backend socket server with auth token
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
      withCredentials: true,
      auth: { token },
      transports: ["websocket"],
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// --- Custom hook to use socket context ---
export const useSocket = () => useContext(SocketContext);