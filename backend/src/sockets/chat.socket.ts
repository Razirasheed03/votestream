import { Server, Socket } from "socket.io";

export interface ChatMessage {
  id: string;
  pollId: string;
  userId: string;
  displayName?: string;
  photoURL?: string;
  text: string;
  createdAt: string;
}

const chatHistory = new Map<string, ChatMessage[]>();
const typingTimers = new Map<string, Map<string, NodeJS.Timeout>>();

const HISTORY_LIMIT = 50;
const TYPING_TIMEOUT_MS = 4000;

const pollRoom = (pollId: string) => `poll:${pollId}`;

type AuthedUser = {
  userId: string;
  displayName: string;
  photoURL?: string;
};

const ensureAuthedUser = (socket: Socket): AuthedUser | null => {
  const userId = (socket.data as any)?.userId as string | undefined;
  if (!userId) return null;

  const decoded = (socket.data as any)?.user as any;
  const displayName =
    decoded?.name || decoded?.displayName || decoded?.email || decoded?.uid || "User";
  const photoURL = decoded?.picture as string | undefined;

  return { userId, displayName, photoURL };
};

const stopTyping = (socket: Socket, pollId: string, userId: string) => {
  const perPoll = typingTimers.get(pollId);
  if (perPoll?.has(userId)) {
    const timer = perPoll.get(userId);
    if (timer) clearTimeout(timer);
    perPoll.delete(userId);
    if (perPoll.size === 0) {
      typingTimers.delete(pollId);
    }
  }

  // Notify others (not the sender)
  socket.to(pollRoom(pollId)).emit("chat:typing-stop", { pollId, userId });
};

const scheduleTypingTimeout = (socket: Socket, pollId: string, userId: string) => {
  const perPoll = typingTimers.get(pollId) ?? new Map<string, NodeJS.Timeout>();

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

export const registerChatSocket = (io: Server, socket: Socket) => {
  const sendHistory = (pollId: string) => {
    const history = chatHistory.get(pollId) ?? [];
    socket.emit("chat:history", history);
  };

  socket.on("chat:join", (pollId: string) => {
    const user = ensureAuthedUser(socket);
    if (!user || !pollId) return;

    socket.join(pollRoom(pollId));
    sendHistory(pollId);
  });

  socket.on("chat:leave", (pollId: string) => {
    const user = ensureAuthedUser(socket);
    if (!user || !pollId) return;

    socket.leave(pollRoom(pollId));
    stopTyping(socket, pollId, user.userId);
  });

  socket.on(
    "chat:message",
    (payload: { pollId?: string; text?: string } | undefined) => {
      const user = ensureAuthedUser(socket);
      if (!user) return;

      const pollId = payload?.pollId?.trim();
      const text = payload?.text?.trim();

      if (!pollId || !text) return;

      const message: ChatMessage = {
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
    }
  );

  socket.on(
    "chat:typing",
    (payload: { pollId?: string } | undefined) => {
      const user = ensureAuthedUser(socket);
      if (!user) return;

      const pollId = payload?.pollId?.trim();
      if (!pollId) return;

      socket.to(pollRoom(pollId)).emit("chat:typing", {
        pollId,
        userId: user.userId,
        displayName: user.displayName,
      });

      scheduleTypingTimeout(socket, pollId, user.userId);
    }
  );

  socket.on(
    "chat:typing-stop",
    (payload: { pollId?: string } | undefined) => {
      const user = ensureAuthedUser(socket);
      if (!user) return;

      const pollId = payload?.pollId?.trim();
      if (!pollId) return;

      stopTyping(socket, pollId, user.userId);
    }
  );

  socket.on("disconnect", () => {
    const user = ensureAuthedUser(socket);
    if (!user) return;

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
