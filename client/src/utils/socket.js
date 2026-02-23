// utils/socket.js
import { io } from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendUrl); // backend URL

export default socket;
