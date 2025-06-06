import { useappStore } from "@/store/usestore";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useappStore();

  useEffect(() => {
    if (userInfo && !socket.current) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });
    }

    const handleReceiveMessage = (message) => {
      const { selectedChatData, selectedChatType, addMessage } =
        useappStore.getState();
      console.log("under receive meassage");
      if (
        selectedChatType !== undefined &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id)
      ) {
        console.log("message received", message);
        addMessage(message);
      }
    };
    const handleReceiveChannelMessage = (message) => {
      const { selectedChatData, selectedChatType, addMessage } =
        useappStore.getState();

      if (selectedChatType && selectedChatData?._id === message.channelId) {
        console.log(
          "message received in socketcontext handle receive channel",
          message
        );
        addMessage(message);
      }
    };
    if (socket.current) {
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);
    }

    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage", handleReceiveMessage);
        socket.current.disconnect();
      }
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
