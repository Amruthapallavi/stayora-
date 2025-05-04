import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export let io: SocketIOServer;

export const initializeSocket = (server: HttpServer): void => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.room).emit("receiveMessage", data);
      console.log("Message sent to room", data.room, data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};