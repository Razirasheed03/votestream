// dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";
import CreatePoll from "../components/CreatePoll";
import MyPolls from "../components/MyPolls";

type Tab = "polls" | "create";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("polls");

  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500">
            {user.displayName} · {user.email}
          </p>
        </div>

        {/* PILLS (SAME SIZE, NEW THEME) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { key: "polls", label: "My Polls", desc: "Manage your polls" },
            { key: "create", label: "Create Poll", desc: "Start a new poll" },
            { key: "discover", label: "Discover", desc: "Explore public polls", external: true },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                tab.external
                  ? router.push("/discover")
                  : setActiveTab(tab.key as Tab)
              }
              className={`group relative rounded-3xl p-6 text-left
                border transition-all duration-300
                ${
                  activeTab === tab.key
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]"
                    : "bg-white border-slate-200 hover:border-slate-400 hover:-translate-y-1 hover:shadow-md"
                }`}
            >
              <h3 className="text-lg font-semibold mb-1">
                {tab.label}
              </h3>
              <p
                className={`text-sm ${
                  activeTab === tab.key ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {tab.desc}
              </p>

              {/* subtle corner accent */}
              <span
                className={`absolute top-4 right-4 h-2 w-2 rounded-full
                  ${
                    activeTab === tab.key
                      ? "bg-white"
                      : "bg-slate-400 group-hover:bg-slate-700"
                  }`}
              />
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === "polls" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              My Polls
            </h3>

            <MyPolls />

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => router.push("/discover")}
                className="group inline-flex items-center gap-3
                           px-6 py-3 rounded-full
                           bg-slate-900 text-white
                           font-medium
                           transition-all duration-200
                           hover:bg-slate-800
                           hover:-translate-y-0.5
                           shadow-md hover:shadow-lg"
              >
                Explore Discover
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <CreatePoll onCancel={() => setActiveTab("polls")} />
        )}

      </main>
    </div>
  );
}
