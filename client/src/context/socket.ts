import React from "react";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const socket = io(socketUrl);
const SocketContext = React.createContext<Socket>(socket);

export { socket, SocketContext };
