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

  /* ---------- ROOM HANDLING ---------- */
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
      socket?.emit("chat:leave", pollId);
    };
  }, [socket, pollId]);

  /* ---------- SOCKET LISTENERS ---------- */
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
        const { [userId]: _, ...rest } = prev;
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

      if (typingTimeoutsRef.current[payload.userId!]) {
        clearTimeout(typingTimeoutsRef.current[payload.userId!]);
      }
      typingTimeoutsRef.current[payload.userId!] = setTimeout(
        () => removeTyping(payload.userId!),
        4500
      );
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

  /* ---------- AUTOSCROLL ---------- */
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------- ACTIONS ---------- */
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
    value.trim().length === 0
      ? socket.emit("chat:typing-stop", { pollId })
      : socket.emit("chat:typing", { pollId });
  };

  const canSend = Boolean(socket?.connected && pollId && user);
  const me = user?.uid;
  const typingNames = Object.values(typingUsers);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">
            Live chat
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            Poll discussion
          </h3>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${
              canSend
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
        >
          {canSend ? "Connected" : "Offline"}
        </span>
      </div>

      {/* MESSAGES */}
      <div
        ref={listRef}
        className="flex-1 min-h-[260px] overflow-y-auto space-y-3 pr-1"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map(msg => {
            const mine = msg.userId === me;
            return (
              <div
                key={msg.id}
                className={`flex ${mine ? "justify-end" : "justify-start"} 
                            animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 border shadow-sm
                    ${
                      mine
                        ? "bg-slate-900 text-white border-slate-800"
                        : "bg-slate-50 text-slate-900 border-slate-200"
                    }`}
                >
                  <div className="flex items-center gap-2 text-xs font-medium mb-1">
                    {!mine && (
                      <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700
                                      flex items-center justify-center font-semibold">
                        {msg.displayName?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <span>{mine ? "You" : msg.displayName || "Guest"}</span>
                    <span className={mine ? "text-slate-300" : "text-slate-400"}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* TYPING */}
      {typingNames.length > 0 && (
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
            <span className="w-2 h-2 bg-slate-400/70 rounded-full animate-pulse [animation-delay:150ms]" />
            <span className="w-2 h-2 bg-slate-400/40 rounded-full animate-pulse [animation-delay:300ms]" />
          </div>
          <span>{typingNames.join(", ")} typing…</span>
        </div>
      )}

      {/* INPUT */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={canSend ? "Type a message…" : "Connect to chat"}
          disabled={!canSend}
          className="flex-1 rounded-xl px-4 py-3
                     border border-slate-300 bg-white
                     outline-none transition
                     focus:border-slate-900"
        />
        <button
          type="submit"
          disabled={!canSend || input.trim().length === 0}
          className={`px-5 rounded-xl font-medium transition
            ${
              !canSend || input.trim().length === 0
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-md"
            }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
