import { io } from "socket.io-client";
import { ServerUrl } from "../config";
import { SOCKET_EVENTS } from "./events";

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(ServerUrl, {
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export { SOCKET_EVENTS };
