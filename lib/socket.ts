import { io, Socket } from "socket.io-client";

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_BASE_URL || "https://backend-just-play-1.onrender.com/api/v1").replace(
    /\/api\/v1\/?$/,
    ""
  )
);

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
