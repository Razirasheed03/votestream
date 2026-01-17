"use client";

import { useEffect, useState } from "react";
import { getMyPolls } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
}

export default function MyPolls() {
  const { user, loading } = useAuth();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;

    const fetchPolls = async () => {
      try {
        const res = await getMyPolls();
        // Normalize options in case API returns string[]
        const normalized = res.polls.map((poll) => ({
          ...poll,
          options: poll.options.map((opt, idx) =>
            typeof opt === "string"
              ? { _id: `${poll._id}-${idx}`, text: opt, votes: 0 }
              : opt
          ),
        }));
        setPolls(normalized as Poll[]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load polls");
        }
      }
    };

    fetchPolls();
  }, [loading, user]);

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (polls.length === 0) {
    return (
      <p className="text-gray-600">
        You haven’t created any polls yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <div
          key={poll._id}
          className="bg-white/70 border-2 border-white/60 rounded-2xl p-5 shadow"
        >
          <h4 className="font-bold text-gray-900 mb-2">
            {poll.question}
          </h4>

          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {poll.options.map((option) => (
              <li key={option._id} className="flex items-center gap-2">
                <span className="font-medium text-gray-800">{option.text}</span>
                <span className="text-xs text-gray-500">({option.votes} votes)</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
