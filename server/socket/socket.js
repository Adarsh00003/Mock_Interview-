import { Server } from "socket.io";
import socketAuth from "../middlewares/socketAuth.js";
import registerInterviewHandlers from "./interviewSocket.js";
import { SOCKET_EVENTS } from "./events.js";
import User from "../models/user.model.js";

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://mock-interview-gamma-flax.vercel.app",
      ],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`Socket connected: ${socket.userId}`);

    registerInterviewHandlers(io, socket);

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      console.log(`Socket disconnected: ${socket.userId}`);

      if (socket.roomId) {
        socket.to(socket.roomId).emit(SOCKET_EVENTS.USER_LEFT, {
          userId: socket.userId,
          participantCount: 0,
          disconnected: true,
        });

        const user = await User.findById(socket.userId).select("name");
        io.to(socket.roomId).emit(SOCKET_EVENTS.NOTIFICATION, {
          type: "user-disconnected",
          message: `${user?.name || "User"} disconnected`,
          userId: socket.userId,
        });
      }
    });
  });

  return io;
};

export const emitToUser = (io, userId, event, data) => {
  for (const [, socket] of io.sockets.sockets) {
    if (socket.userId === userId) {
      socket.emit(event, data);
    }
  }
};

export default initSocket;
