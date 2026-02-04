"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPollSocket = void 0;
const registerPollSocket = (io, socket, pollService) => {
    const getUserId = () => {
        return socket.data?.userId ?? null;
    };
    socket.on("join-poll", (pollId) => {
        socket.join(`poll:${pollId}`);
    });
    socket.on("leave-poll", (pollId) => {
        socket.leave(`poll:${pollId}`);
    });
    socket.on("vote", async (payload) => {
        const userId = getUserId();
        if (!userId) {
            return;
        }
        const { pollId, optionId } = payload || {};
        if (!pollId || !optionId)
            return;
        try {
            await pollService.vote(pollId, optionId, userId);
            const updated = await pollService.getPollView(pollId);
            if (updated) {
                io.to(`poll:${pollId}`).emit("poll-updated", updated);
            }
        }
        catch (err) {
            // silent per requirements
        }
    });
};
exports.registerPollSocket = registerPollSocket;
//# sourceMappingURL=poll.socket.js.map