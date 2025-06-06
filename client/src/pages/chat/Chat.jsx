import React, { use, useEffect } from "react";
// import { useAppStore } from "@/store/usestore";
import { useappStore } from "../../store/usestore.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container/ChatContainer.jsx";
import ContactsContainer from "./components/contacts-container/ContactsContainer.jsx";
import EtChatContainer from "./components/empty-chat-container/EtChatContainer.jsx";
const Chat = () => {
  const { userInfo, selectedChatType } = useappStore();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Chat page");
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  console.log("selectedChatType in Chat:", selectedChatType);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {selectedChatType === undefined ? <EtChatContainer /> : <ChatContainer />}
    </div>
  );
};

export default Chat;
