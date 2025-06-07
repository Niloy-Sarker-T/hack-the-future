import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { usersTable } from "./db/schema/users.js";
import { eq } from "drizzle-orm";
import { db } from "../db/db.config.js";



// --- Chat Event Enum ---
export const ChatEventEnum = {
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_CHAT_EVENT: "joinChat",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",
  SOCKET_ERROR_EVENT: "socketError",
  // ...add more as needed
};

// --- Mount Chat Events ---
const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

// --- Initialize Socket.IO ---
const initializeSocketIO = (io) => {
  io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      let token = cookies?.accessToken || socket.handshake.auth?.token;
      if (!token) throw new Error("Un-authorized handshake. Token is missing");

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // Fetch user from Drizzle
      const userArr = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, decodedToken?._id));
      const user = userArr[0];
      if (!user) throw new Error("Un-authorized handshake. Token is invalid");

      socket.user = user;
      socket.join(user.id);
      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log("User connected 🗼. userId: ", user.id);

      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id);
        }
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};

// --- Utility to emit events from controllers ---
export const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

// --- Start Server ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
});
initializeSocketIO(io);

// Attach io to app for controller access
app.set("io", io);

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});