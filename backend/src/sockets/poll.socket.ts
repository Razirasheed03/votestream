import { Server, Socket } from "socket.io";
import { IPollService } from "../services/interfaces/poll.service.interface";

export const registerPollSocket = (io: Server, socket: Socket, pollService: IPollService) => {
  const getUserId = (): string | null => {
    return (socket.data as any)?.userId ?? null;
  };

  socket.on("join-poll", (pollId: string) => {
    socket.join(`poll:${pollId}`);
  });

  socket.on("leave-poll", (pollId: string) => {
    socket.leave(`poll:${pollId}`);
  });

  socket.on("vote", async (payload: { pollId: string; optionId: string }) => {
    const userId = getUserId();
    if (!userId) {
      return;
    }

    const { pollId, optionId } = payload || {};
    if (!pollId || !optionId) return;

    try {
      await pollService.vote(pollId, optionId, userId);
      const updated = await pollService.getPollView(pollId);
      if (updated) {
        io.to(`poll:${pollId}`).emit("poll-updated", updated);
      }
    } catch (err) {
      // silent per requirements
    }
  });
};
