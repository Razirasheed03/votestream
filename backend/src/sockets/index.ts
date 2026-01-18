import { Server, Socket } from "socket.io";
import { firebaseAdmin } from "../config/firebase";
import { pollService } from "../dependencies/poll.di";
import { registerPollSocket } from "./poll.socket";

export const initializeSocketServer = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token =
        (socket.handshake.auth as any)?.token ||
        (socket.handshake.headers?.authorization as string | undefined)?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      (socket.data as any).user = decodedToken;
      (socket.data as any).userId = decodedToken.uid;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket: Socket) => {
    registerPollSocket(io, socket, pollService);
  });
};
