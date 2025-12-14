// import dotenv from 'dotenv';
// dotenv.config();
// import app from './app.js';
// import http from "http"
// import { Server } from 'socket.io';

// const PORT = process.env.PORT || 3000;

// const server = http.createServer(app);

// // initialize socket.io server
// export const io = new Server(server,{
//     cors: {origin: "*"}
// })

// // store online users
// export const userSocketMap = {}; // userId: socketId

// // Socket.io connection handler
// io.on("connection", (socket) =>{
//     const userId = socket.handshake.query.userId;
//     console.log("user connceted:", userId);

//     if(userId) userSocketMap[userId] = socket.id;

//     //Emit online users to all conncected clients
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     // Disconncet users
//     // socket.on("disconnect", ()=>{
//     //     console.log("user disconnected", userId);
//     //     delete userSocketMap[userId];
//     //     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     // })
// })

// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`)
// }).on('error', (err) => {
//     console.error('Server failed to start:', err.message);
// });

import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from "http";
import { Server } from 'socket.io';

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

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("joinCourse", (courseId) => {
        socket.join(courseId);
        console.log(`Socket ${socket.id} joined course ${courseId}`);
    });

    socket.on("disconnect", () => {
        if (userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log("User disconnected:", userId);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
