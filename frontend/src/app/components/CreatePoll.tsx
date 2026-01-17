// frontend/src/app/components/CreatePoll.tsx
"use client";

import { useState } from "react";
import { createPoll } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface PollOption {
  id: number;
  text: string;
}

export default function CreatePoll({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const { user, loading } = useAuth();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions((prev) => [
      ...prev,
      { id: prev.length + 1, text: "" },
    ]);
  };

  const removeOption = (id: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const updateOption = (id: number, value: string) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, text: value } : o
      )
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (loading || !user) {
      setError("Authentication not ready. Please wait.");
      return;
    }

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError("Question is required");
      return;
    }

    const validOptions = options
      .map((o) => o.text.trim())
      .filter(Boolean);

    if (validOptions.length < 2) {
      setError("At least 2 options are required");
      return;
    }

    setSubmitting(true);
    try {
      await createPoll({
        question: trimmedQuestion,
        options: validOptions,
      });

      setSuccess("Poll created successfully!");
      setQuestion("");
      setOptions([
        { id: 1, text: "" },
        { id: 2, text: "" },
      ]);

      setTimeout(() => {
        onCancel();
        setSuccess(null);
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create poll");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-2xl border-2 border-white/60 rounded-3xl p-8 shadow-2xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 font-semibold">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">
            Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full rounded-xl border-2 border-blue-200 px-4 py-3 outline-none resize-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-bold text-sm">Options</label>
            <span className="text-xs text-gray-500">
              Min 2 • Max 6
            </span>
          </div>

          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-3"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600">
                {option.id}
              </span>

              <input
                type="text"
                value={option.text}
                onChange={(e) =>
                  updateOption(option.id, e.target.value)
                }
                className="flex-1 rounded-xl border-2 border-blue-200 px-3 py-2 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => removeOption(option.id)}
                disabled={options.length <= 2}
                className="text-red-500 disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addOption}
            disabled={options.length >= 6}
            className="text-sm font-bold text-blue-600 hover:underline disabled:opacity-40"
          >
            + Add Option
          </button>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-lg disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Poll"}
          </button>
        </div>
      </div>
    </div>
  );
}
