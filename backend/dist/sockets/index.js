"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketServer = void 0;
const firebase_1 = require("../config/firebase");
const poll_di_1 = require("../dependencies/poll.di");
const poll_socket_1 = require("./poll.socket");
const chat_socket_1 = require("./chat.socket");
const initializeSocketServer = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.split(" ")[1];
            if (!token) {
                return next(new Error("Authentication token missing"));
            }
            const decodedToken = await firebase_1.firebaseAdmin.auth().verifyIdToken(token);
            socket.data.user = decodedToken;
            socket.data.userId = decodedToken.uid;
            next();
        }
        catch (err) {
            next(new Error("Authentication failed"));
        }
    });
    io.on("connection", (socket) => {
        (0, poll_socket_1.registerPollSocket)(io, socket, poll_di_1.pollService);
        (0, chat_socket_1.registerChatSocket)(io, socket);
    });
};
exports.initializeSocketServer = initializeSocketServer;
//# sourceMappingURL=index.js.map