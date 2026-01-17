import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from "http";
import { Server } from 'socket.io';
import nodeCron from 'node-cron';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: { origin: "*" }
});

// userId => socketId
export const userSocketMap = {};

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

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});