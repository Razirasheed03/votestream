"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatSocket = void 0;
const chatHistory = new Map();
const typingTimers = new Map();
const HISTORY_LIMIT = 50;
const TYPING_TIMEOUT_MS = 4000;
const pollRoom = (pollId) => `poll:${pollId}`;
const ensureAuthedUser = (socket) => {
    const userId = socket.data?.userId;
    if (!userId)
        return null;
    const decoded = socket.data?.user;
    const displayName = decoded?.name || decoded?.displayName || decoded?.email || decoded?.uid || "User";
    const photoURL = decoded?.picture;
    return { userId, displayName, photoURL };
};
const stopTyping = (socket, pollId, userId) => {
    const perPoll = typingTimers.get(pollId);
    if (perPoll?.has(userId)) {
        const timer = perPoll.get(userId);
        if (timer)
            clearTimeout(timer);
        perPoll.delete(userId);
        if (perPoll.size === 0) {
            typingTimers.delete(pollId);
        }
    }
    // Notify others (not the sender)
    socket.to(pollRoom(pollId)).emit("chat:typing-stop", { pollId, userId });
};
const scheduleTypingTimeout = (socket, pollId, userId) => {
    const perPoll = typingTimers.get(pollId) ?? new Map();
    if (perPoll.has(userId)) {
        clearTimeout(perPoll.get(userId));
    }
    const timer = setTimeout(() => {
        perPoll.delete(userId);
        if (perPoll.size === 0) {
            typingTimers.delete(pollId);
        }
        socket.to(pollRoom(pollId)).emit("chat:typing-stop", { pollId, userId });
    }, TYPING_TIMEOUT_MS);
    perPoll.set(userId, timer);
    typingTimers.set(pollId, perPoll);
};
const registerChatSocket = (io, socket) => {
    const sendHistory = (pollId) => {
        const history = chatHistory.get(pollId) ?? [];
        socket.emit("chat:history", history);
    };
    socket.on("chat:join", (pollId) => {
        const user = ensureAuthedUser(socket);
        if (!user || !pollId)
            return;
        socket.join(pollRoom(pollId));
        sendHistory(pollId);
    });
    socket.on("chat:leave", (pollId) => {
        const user = ensureAuthedUser(socket);
        if (!user || !pollId)
            return;
        socket.leave(pollRoom(pollId));
        stopTyping(socket, pollId, user.userId);
    });
    socket.on("chat:message", (payload) => {
        const user = ensureAuthedUser(socket);
        if (!user)
            return;
        const pollId = payload?.pollId?.trim();
        const text = payload?.text?.trim();
        if (!pollId || !text)
            return;
        const message = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            pollId,
            userId: user.userId,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: text.slice(0, 500),
            createdAt: new Date().toISOString(),
        };
        const history = chatHistory.get(pollId) ?? [];
        const next = [...history, message].slice(-HISTORY_LIMIT);
        chatHistory.set(pollId, next);
        io.to(pollRoom(pollId)).emit("chat:new-message", message);
        stopTyping(socket, pollId, user.userId);
    });
    socket.on("chat:typing", (payload) => {
        const user = ensureAuthedUser(socket);
        if (!user)
            return;
        const pollId = payload?.pollId?.trim();
        if (!pollId)
            return;
        socket.to(pollRoom(pollId)).emit("chat:typing", {
            pollId,
            userId: user.userId,
            displayName: user.displayName,
        });
        scheduleTypingTimeout(socket, pollId, user.userId);
    });
    socket.on("chat:typing-stop", (payload) => {
        const user = ensureAuthedUser(socket);
        if (!user)
            return;
        const pollId = payload?.pollId?.trim();
        if (!pollId)
            return;
        stopTyping(socket, pollId, user.userId);
    });
    socket.on("disconnect", () => {
        const user = ensureAuthedUser(socket);
        if (!user)
            return;
        typingTimers.forEach((perPoll, pollId) => {
            if (perPoll.has(user.userId)) {
                perPoll.delete(user.userId);
                if (perPoll.size === 0) {
                    typingTimers.delete(pollId);
                }
                socket.to(pollRoom(pollId)).emit("chat:typing-stop", {
                    pollId,
                    userId: user.userId,
                });
            }
        });
    });
};
exports.registerChatSocket = registerChatSocket;
//# sourceMappingURL=chat.socket.js.map