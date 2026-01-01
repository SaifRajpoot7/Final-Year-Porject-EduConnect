import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from "http";
import { Server } from 'socket.io';
import nodeCron from 'node-cron';
// import lectureSocket from "./sockets/lecture.socket.js";

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

    // // === Lecture Module Integration ===
    // socket.on("joinLecture", ({ lectureId, userId }) => {
    //     socket.join(lectureId);
    //     console.log(`${userId} joined lecture ${lectureId}`);
    // });

    // socket.on("signal", ({ lectureId, signal, to }) => {
    //     if (to) {
    //         // Send to specific peer
    //         io.to(to).emit("signal", { signal, from: socket.id });
    //     } else {
    //         // Broadcast to everyone else in lecture
    //         socket.to(lectureId).emit("signal", { signal, from: socket.id });
    //     }
    // });

    // // Any additional lecture logic in separate module
    // lectureSocket(io, socket);

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


// // import dotenv from 'dotenv';
// // dotenv.config();
// // import app from './app.js';
// // import http from "http";
// // import { Server } from 'socket.io';

// // const PORT = process.env.PORT || 3000;

// // const server = http.createServer(app);

// // export const io = new Server(server, {
// //     cors: { origin: "*" }
// // });

// // // Map to store online users: userId => socketId
// // export const userSocketMap = {};

// // // io.on("connection", (socket) => {
// // //     const userId = socket.handshake.query.userId;

// // //     if (userId) {
// // //         userSocketMap[userId] = socket.id;
// // //         console.log("User connected:", userId);
// // //     }

// // //     // Broadcast online users to all clients
// // //     io.emit("getOnlineUsers", Object.keys(userSocketMap));

// // //     // Join course room
// // //     socket.on("joinCourse", (courseId) => {
// // //         socket.join(courseId);
// // //         console.log(`Socket ${socket.id} joined course ${courseId}`);
// // //     });


// // //     // Handle disconnect
// // //     socket.on("disconnect", () => {
// // //         if (userId) delete userSocketMap[userId];
// // //         io.emit("getOnlineUsers", Object.keys(userSocketMap));
// // //         console.log("User disconnected:", userId);
// // //     });
// // // });

// // io.on("connection", (socket) => {
// //     const userId = socket.handshake.query.userId;
// //     const role = socket.handshake.query.role; // "teacher" or "student"
// //     const lectureId = socket.handshake.query.lectureId;

// //     if (!userId || !lectureId) return;

// //     socket.join(lectureId);

// //     console.log(`${role} ${userId} joined lecture ${lectureId}`);

// //     // Broadcast online users in lecture room
// //     const lectureUsers = Array.from(io.sockets.adapter.rooms.get(lectureId) || []);
// //     io.to(lectureId).emit("lecture-users", lectureUsers);

// //     // Handle WebRTC signaling
// //     socket.on("signal", (data) => {
// //         // data: { to, from, signal }
// //         io.to(data.to).emit("signal", { from: data.from, signal: data.signal });
// //     });

// //     // Teacher grants media permissions
// //     socket.on("set-media-permission", ({ targetUserId, media }) => {
// //         io.to(targetUserId).emit("media-permission", media);
// //     });

// //     socket.on("disconnect", () => {
// //         console.log(`${role} ${userId} disconnected from lecture ${lectureId}`);
// //         io.to(lectureId).emit("lecture-users", Array.from(io.sockets.adapter.rooms.get(lectureId) || []));
// //     });
// // });



// // server.listen(PORT, () => {
// //     console.log(`Server listening on port ${PORT}`);
// // });


// import dotenv from 'dotenv';
// dotenv.config();
// import app from './app.js';
// import http from "http";
// import { Server } from 'socket.io';

// const PORT = process.env.PORT || 3000;

// const server = http.createServer(app);

// export const io = new Server(server, {
//   cors: { origin: "*" }
// });

// // Map: userId => socketId
// export const userSocketMap = {};

// // Map: lectureId => Set of socketIds in that lecture
// export const lectureRooms = {};

// io.on("connection", socket => {
//   const { userId, role, lectureId } = socket.handshake.query;

//   if (!userId) return;

//   userSocketMap[userId] = socket.id;

//   console.log(`User connected: ${userId} | role: ${role}`);

//   if (lectureId) {
//     socket.join(lectureId);

//     if (!lectureRooms[lectureId]) lectureRooms[lectureId] = new Set();
//     lectureRooms[lectureId].add(socket.id);

//     console.log(`Socket ${socket.id} joined lecture ${lectureId}`);
//   }

//   // Send online users in lecture
//   const emitLectureUsers = () => {
//     const sockets = lectureRooms[lectureId] ? Array.from(lectureRooms[lectureId]) : [];
//     io.to(lectureId).emit("lectureUsers", sockets);
//   };

//   emitLectureUsers();

//   /**
//    * WebRTC Signaling
//    */

//   // Teacher/Student sends offer to another user
//   socket.on("webrtcOffer", ({ targetId, offer }) => {
//     const targetSocket = userSocketMap[targetId];
//     if (targetSocket) {
//       io.to(targetSocket).emit("webrtcOffer", { fromId: userId, offer });
//     }
//   });

//   // Send answer back
//   socket.on("webrtcAnswer", ({ targetId, answer }) => {
//     const targetSocket = userSocketMap[targetId];
//     if (targetSocket) {
//       io.to(targetSocket).emit("webrtcAnswer", { fromId: userId, answer });
//     }
//   });

//   // ICE Candidate exchange
//   socket.on("webrtcIceCandidate", ({ targetId, candidate }) => {
//     const targetSocket = userSocketMap[targetId];
//     if (targetSocket) {
//       io.to(targetSocket).emit("webrtcIceCandidate", { fromId: userId, candidate });
//     }
//   });

//   /**
//    * Teacher allows media for student(s)
//    */
//   socket.on("allowMedia", ({ studentId, permissions }) => {
//     const targetSocket = userSocketMap[studentId];
//     if (targetSocket) {
//       io.to(targetSocket).emit("mediaAllowed", permissions);
//     }
//   });

//   // Disconnect
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${userId}`);
//     delete userSocketMap[userId];

//     if (lectureId && lectureRooms[lectureId]) {
//       lectureRooms[lectureId].delete(socket.id);
//       emitLectureUsers();
//     }
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
