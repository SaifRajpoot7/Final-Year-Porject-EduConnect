// server.js
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js'; // Imports routes, which import socket.js (safe now)
import http from "http";
import { initSocket } from './socket.js'; // Import the initializer
import nodeCron from 'node-cron';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io attached to the server
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});