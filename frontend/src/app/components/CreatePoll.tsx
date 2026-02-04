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

  const [title, setTitle] = useState("");
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

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
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
        title: trimmedTitle,
        question: trimmedQuestion,
        options: validOptions,
      });

      setSuccess("Poll created successfully!");
      setTitle("");
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
    <div
      className="relative bg-white border border-slate-200 rounded-3xl p-8
                 shadow-sm transition-all duration-300
                 animate-in fade-in slide-in-from-bottom-2"
    >
      {error && (
        <div
          className="mb-6 p-4 rounded-xl border border-red-200
                     bg-red-50 text-red-700 font-medium
                     animate-in fade-in slide-in-from-top-2"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="mb-6 p-4 rounded-xl border border-emerald-200
                     bg-emerald-50 text-emerald-700 font-medium
                     animate-in fade-in slide-in-from-top-2"
        >
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* TITLE */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300
                       px-4 py-3 outline-none
                       transition-all
                       focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* QUESTION */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-300
                       px-4 py-3 resize-none outline-none
                       transition-all
                       focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* OPTIONS */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-medium text-sm text-slate-900">
              Options
            </label>
            <span className="text-xs text-slate-500">
              Min 2 • Max 6
            </span>
          </div>

          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-3
                         animate-in fade-in slide-in-from-left-2"
            >
              <span
                className="w-8 h-8 flex items-center justify-center
                           rounded-lg bg-slate-100
                           font-medium text-slate-700"
              >
                {option.id}
              </span>

              <input
                type="text"
                value={option.text}
                onChange={(e) =>
                  updateOption(option.id, e.target.value)
                }
                className="flex-1 rounded-xl border border-slate-300
                           px-3 py-2 outline-none
                           transition-all
                           focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />

              <button
                type="button"
                onClick={() => removeOption(option.id)}
                disabled={options.length <= 2}
                className="text-red-500 font-medium
                           transition-opacity
                           hover:opacity-80
                           disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addOption}
            disabled={options.length >= 6}
            className="text-sm font-medium text-slate-700
                       hover:underline
                       transition-opacity
                       disabled:opacity-40"
          >
            + Add Option
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-300
                       font-medium text-slate-700
                       hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-7 py-3 rounded-full
                       bg-slate-900 text-white
                       font-medium
                       transition-all duration-200
                       hover:bg-slate-800
                       hover:-translate-y-0.5
                       shadow-md hover:shadow-lg
                       disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create Poll"}
          </button>
        </div>
      </div>
    </div>
  );
}
