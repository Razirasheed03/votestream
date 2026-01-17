"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PollCarousel from "../components/discover/PollCarousel";
import PollDetails from "../components/discover/PollDetails";
import ChatPanel from "../components/discover/ChatPanel";
import { Poll } from "../components/discover/Types";
import { getActivePolls, voteOnPoll } from "../../lib/api";
import Navbar from "../components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<string>("");

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

  const handleVote = async (optionId: string) => {
    if (!selectedPollId) return;

    try {
      await voteOnPoll(selectedPollId, optionId);
      const refreshed = await getActivePolls();
      setPolls(refreshed);
      if (refreshed.some(p => p.id === selectedPollId)) {
        setSelectedPollId(selectedPollId);
      } else if (refreshed.length > 0) {
        setSelectedPollId(refreshed[0].id);
      }
    } catch (err) {
      console.error("Failed to submit vote", err);
    }
  };

  const selectedPoll = polls.find(p => p.id === selectedPollId);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <Navbar/>
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        <h1 className="text-3xl font-extrabold text-emerald-700">
          Discover Polls
        </h1>

        <PollCarousel
          polls={polls}
          selectedPollId={selectedPollId}
          onSelect={setSelectedPollId}
        />

        {selectedPoll && (
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
            <PollDetails poll={selectedPoll} onVote={handleVote} />
            <ChatPanel />
          </div>
        )}
      </main>
    </div>
  );
}
