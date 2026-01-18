import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./http";
import { auth } from "./firebase";

function backendSocketUrl(): string {
  return API_BASE_URL.replace(/\/api$/, "");
}

export async function createAuthedSocket(): Promise<Socket> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not authenticated");
  }

  const token = await user.getIdToken();

  return io(backendSocketUrl(), {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });
}
