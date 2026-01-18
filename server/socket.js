// socket.js
import { Server } from 'socket.io';

let io;

// Move the map here so it can be imported anywhere
export const userSocketMap = {};

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log("User connected:", userId);
    }

    // Broadcast online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Join course room
    socket.on("joinCourse", (courseId) => {
      socket.join(courseId);
      console.log(`Socket ${socket.id} joined course ${courseId}`);
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      if (userId) delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log("User disconnected:", userId);
    });
  });

  return io;
};

// Export a function to get the instance in other files
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};