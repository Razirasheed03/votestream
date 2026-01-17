// import { Server } from "socket.io";
// import { firebaseAdmin } from "../config/firebase";
// import { PollService } from "../services/implements/PollService";
// import { registerPollSocket } from "./poll.socket";

// export const initializeSocketServer = (
//   io: Server,
//   pollService: PollService
// ) => {
//   io.use(async (socket, next) => {
//     try {
//       const token =
//         socket.handshake.auth?.token ||
//         socket.handshake.headers?.authorization?.split(" ")[1];

//       if (!token) {
//         return next(new Error("Authentication token missing"));
//       }

//       const decodedToken = await firebaseAdmin
//         .auth()
//         .verifyIdToken(token);

//       socket.data.user = decodedToken;
//       next();
//     } catch (err) {
//       next(new Error("Authentication failed"));
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.data.user?.uid);

//     registerPollSocket(socket);
//   });
// };
