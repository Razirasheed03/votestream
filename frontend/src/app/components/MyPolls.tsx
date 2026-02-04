"use client";

import { useEffect, useState } from "react";
import { deletePoll, getMyPolls } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  title: string;
  question: string;
  options: PollOption[];
  createdAt: string;
}

export default function MyPolls() {
  const { user, loading } = useAuth();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const handleDelete = async (pollId: string) => {
    setDeletingId(pollId);
    setError(null);
    try {
      await deletePoll(pollId);
      setPolls(prev => prev.filter(poll => poll._id !== pollId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete poll");
      }
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

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
      {confirmDeleteId && (
        <div className="fixed bottom-6 right-6 z-50 w-[320px]
                        rounded-2xl border border-slate-200
                        bg-white shadow-xl p-4">
          <p className="text-sm font-semibold text-slate-900">
            Delete this poll?
          </p>
          <p className="text-xs text-slate-500 mt-1">
            This action can’t be undone.
          </p>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmDeleteId(null)}
              className="px-3 py-1.5 text-xs font-semibold
                         text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(confirmDeleteId)}
              disabled={deletingId === confirmDeleteId}
              className="px-3 py-1.5 rounded-full text-xs font-semibold
                         bg-red-600 text-white hover:bg-red-700
                         disabled:opacity-60"
            >
              {deletingId === confirmDeleteId ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
      {polls.map((poll) => (
        <div
          key={poll._id}
          className="bg-white/70 border-2 border-white/60 rounded-2xl p-5 shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-900">
                {poll.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {poll.question}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConfirmDeleteId(poll._id)}
              disabled={deletingId === poll._id}
              className="text-xs font-semibold text-red-600
                         hover:text-red-700 transition
                         disabled:opacity-40"
            >
              {deletingId === poll._id ? "Deleting..." : "Delete"}
            </button>
          </div>

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
