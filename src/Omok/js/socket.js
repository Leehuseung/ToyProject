import socketio from "socket.io-client";

export const chatSocket = socketio.connect('http://localhost:5000');
