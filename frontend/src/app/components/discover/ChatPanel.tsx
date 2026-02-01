"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage } from "./Types";

interface ChatPanelProps {
  socket: Socket | null;
  pollId: string;
}

export default function ChatPanel({ socket, pollId }: ChatPanelProps) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const previousPollRef = useRef<string | null>(null);
  const currentPollRef = useRef<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);

  // Join/leave chat rooms per poll
  useEffect(() => {
    currentPollRef.current = pollId;
    setMessages([]);
    setTypingUsers({});
    Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
    typingTimeoutsRef.current = {};

    if (!socket || !pollId) return;

    if (previousPollRef.current && previousPollRef.current !== pollId) {
      socket.emit("chat:leave", previousPollRef.current);
    }
    socket.emit("chat:join", pollId);
    previousPollRef.current = pollId;

    return () => {
      if (socket && pollId) {
        socket.emit("chat:leave", pollId);
      }
    };
  }, [socket, pollId]);

  // Register socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleHistory = (history: ChatMessage[]) => {
      const activePollId = currentPollRef.current;
      setMessages(history.filter(m => m.pollId === activePollId));
    };

    const handleNewMessage = (message: ChatMessage) => {
      if (message.pollId !== currentPollRef.current) return;
      setMessages(prev => [...prev, message]);
    };

    const removeTyping = (userId: string) => {
      setTypingUsers(prev => {
        if (!(userId in prev)) return prev;
        const { [userId]: _removed, ...rest } = prev;
        return rest;
      });
      const timer = typingTimeoutsRef.current[userId];
      if (timer) {
        clearTimeout(timer);
        delete typingTimeoutsRef.current[userId];
      }
    };

    const handleTyping = (payload: { pollId?: string; userId?: string; displayName?: string }) => {
      if (!payload?.pollId || payload.pollId !== currentPollRef.current) return;
      if (!payload.userId || payload.userId === user?.uid) return;

      setTypingUsers(prev => ({ ...prev, [payload.userId!]: payload.displayName || "Someone" }));

      if (typingTimeoutsRef.current[payload.userId]) {
        clearTimeout(typingTimeoutsRef.current[payload.userId]);
      }
      typingTimeoutsRef.current[payload.userId] = setTimeout(() => removeTyping(payload.userId!), 4500);
    };

    const handleTypingStop = (payload: { pollId?: string; userId?: string }) => {
      if (!payload?.pollId || payload.pollId !== currentPollRef.current) return;
      if (!payload.userId || payload.userId === user?.uid) return;
      removeTyping(payload.userId);
    };

    socket.on("chat:history", handleHistory);
    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:typing-stop", handleTypingStop);

    return () => {
      socket.off("chat:history", handleHistory);
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:typing-stop", handleTypingStop);
    };
  }, [socket, user?.uid]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || !socket.connected || !pollId) return;
    const text = input.trim();
    if (!text) return;
    socket.emit("chat:message", { pollId, text });
    socket.emit("chat:typing-stop", { pollId });
    setInput("");
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!socket || !pollId) return;
    if (value.trim().length === 0) {
      socket.emit("chat:typing-stop", { pollId });
    } else {
      socket.emit("chat:typing", { pollId });
    }
  };

  const canSend = Boolean(socket?.connected && pollId && user);
  const me = user?.uid;
  const activeTypingNames = Object.entries(typingUsers).map(([, name]) => name);

  return (
    <div className="bg-white/80 rounded-3xl p-6 border-2 border-white/60 shadow flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-semibold">Live chat</p>
          <h3 className="font-extrabold text-gray-900 text-lg">Poll Discussion</h3>
        </div>
        <div
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            canSend ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {canSend ? "Connected" : "Offline"}
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 min-h-[260px] overflow-y-auto space-y-3 pr-1"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => {
            const mine = msg.userId === me;
            return (
              <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm border ${
                    mine
                      ? "bg-emerald-500 text-white border-emerald-400"
                      : "bg-gray-50 text-gray-900 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                    {!mine && (
                      <div className="h-8 w-8 bg-gradient-to-br from-emerald-200 to-lime-200 rounded-full flex items-center justify-center text-emerald-800 font-bold">
                        {msg.displayName?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <span>{mine ? "You" : msg.displayName || "Guest"}</span>
                    <span className={`${mine ? "text-emerald-100" : "text-gray-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeTypingNames.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 mt-2">
          <div className="flex gap-1">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="inline-block w-2 h-2 bg-emerald-400/70 rounded-full animate-pulse [animation-delay:150ms]" />
            <span className="inline-block w-2 h-2 bg-emerald-400/40 rounded-full animate-pulse [animation-delay:300ms]" />
          </div>
          <span>{activeTypingNames.join(", ")} typing...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={canSend ? "Type a message..." : "Connect to chat to start"}
          disabled={!canSend}
          className="flex-1 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-emerald-400 outline-none bg-white shadow-inner"
        />
        <button
          type="submit"
          disabled={!canSend || input.trim().length === 0}
          className={`px-5 rounded-xl font-bold transition shadow ${
            !canSend || input.trim().length === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
