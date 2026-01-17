"use client";

import { useEffect, useState } from "react";
import { getMyPolls } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Poll {
  _id: string;
  question: string;
  options: string[];
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
        setPolls(res.polls);
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

          <ul className="list-disc pl-5 text-gray-700">
            {poll.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
