"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Socket } from "socket.io-client";
import PollCarousel from "../components/discover/PollCarousel";
import PollDetails from "../components/discover/PollDetails";
import ChatPanel from "../components/discover/ChatPanel";
import { Poll } from "../components/discover/Types";
import { getActivePolls, voteOnPoll } from "../../lib/api";
import Navbar from "../components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { createAuthedSocket } from "@/lib/socket";

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const previousPollIdRef = useRef<string | null>(null);

  /* ---------- SOCKET SETUP ---------- */
  useEffect(() => {
    if (loading || !user) return;

    let active = true;

    (async () => {
      try {
        const socket = await createAuthedSocket();
        if (!active) {
          socket.disconnect();
          return;
        }

        socketRef.current = socket;

        socket.on("poll-updated", (updated: Poll) => {
          setPolls(prev => {
            const exists = prev.find(p => p.id === updated.id);
            if (exists) {
              return prev.map(p => (p.id === updated.id ? updated : p));
            }
            return [...prev, updated];
          });
        });
      } catch (err) {
        console.error("Socket connection failed", err);
      }
    })();

    return () => {
      active = false;
      if (socketRef.current) {
        if (previousPollIdRef.current) {
          socketRef.current.emit("leave-poll", previousPollIdRef.current);
        }
        socketRef.current.disconnect();
      }
      socketRef.current = null;
    };
  }, [loading, user]);

  /* ---------- LOAD POLLS ---------- */
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }

    const load = async () => {
      try {
        const activePolls = await getActivePolls();
        setPolls(activePolls);
        if (activePolls.length > 0) {
          setSelectedPollId(activePolls[0].id);
        }
      } catch (err) {
        console.error("Failed to load polls", err);
      }
    };

    load();
  }, [loading, user, router]);

  /* ---------- JOIN / LEAVE POLL ROOMS ---------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedPollId) return;

    const previous = previousPollIdRef.current;
    if (previous && previous !== selectedPollId) {
      socket.emit("leave-poll", previous);
    }
    socket.emit("join-poll", selectedPollId);
    previousPollIdRef.current = selectedPollId;
  }, [selectedPollId]);

  /* ---------- VOTING ---------- */
  const handleVote = async (optionId: string) => {
    if (!selectedPollId) return;

    try {
      const socket = socketRef.current;
      if (socket) {
        socket.emit("vote", { pollId: selectedPollId, optionId });
      } else {
        await voteOnPoll(selectedPollId, optionId);
        const refreshed = await getActivePolls();
        setPolls(refreshed);
        if (refreshed.some(p => p.id === selectedPollId)) {
          setSelectedPollId(selectedPollId);
        } else if (refreshed.length > 0) {
          setSelectedPollId(refreshed[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to submit vote", err);
    }
  };

  const selectedPoll = polls.find(p => p.id === selectedPollId);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
{/* HEADER */}
<div className="flex flex-col gap-1">
  <button
    onClick={() => router.push("/dashboard")}
    className="inline-flex items-center gap-2 text-sm
               text-slate-500 hover:text-slate-900
               transition w-fit"
  >
    <span className="text-lg leading-none">←</span>
    Back to dashboard
  </button>

  <h1 className="text-2xl font-semibold tracking-tight leading-tight">
    Discover polls
  </h1>
</div>


        {/* CAROUSEL */}
        <div>
          <PollCarousel
            polls={polls}
            selectedPollId={selectedPollId}
            onSelect={setSelectedPollId}
          />
        </div>

        {/* DETAILS + CHAT */}
        {selectedPoll && (
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
            <PollDetails poll={selectedPoll} onVote={handleVote} />
            <ChatPanel socket={socketRef.current} pollId={selectedPollId} />
          </div>
        )}

      </main>
    </div>
  );
}
