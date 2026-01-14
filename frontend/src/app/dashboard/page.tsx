"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";

type Tab = "overview" | "polls" | "create";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // silent redirect (no loader, no flicker)
  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  // wait until auth resolves
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f2fd] via-[#f5f9ff] to-[#e1f5fe] relative overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-sky-400/15 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(2,136,209,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(2,136,209,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <Navbar />

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user.displayName}
          </h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "overview", label: "Overview" },
            { key: "polls", label: "My Polls" },
            { key: "create", label: "Create Poll" },
            { key: "discover", label: "Discover", external: true },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                tab.external
                  ? router.push("/")
                  : setActiveTab(tab.key as Tab)
              }
              className={`rounded-2xl p-5 text-left border-2 backdrop-blur transition
                ${
                  activeTab === tab.key
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-white/60 bg-white/70 hover:border-blue-300"
                }`}
            >
              <h3 className="font-bold text-gray-900">
                {tab.label}
              </h3>
              <p className="text-sm text-gray-600">
                {tab.key === "overview" && "Dashboard summary"}
                {tab.key === "polls" && "View all polls"}
                {tab.key === "create" && "Start new poll"}
                {tab.key === "discover" && "Explore polls"}
              </p>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="bg-white/70 backdrop-blur border-2 border-white/60 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <p className="text-gray-600">
              No polls yet. Create your first poll to get started.
            </p>
          </div>
        )}

        {activeTab === "polls" && (
          <div className="bg-white/70 backdrop-blur border-2 border-white/60 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-4">My Polls</h3>
            <p className="text-gray-600">You have no polls yet.</p>
          </div>
        )}

        {activeTab === "create" && (
          <div className="bg-white/70 backdrop-blur border-2 border-white/60 rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Create Poll</h3>
            <p className="text-gray-600">
              Poll creation form goes here (next step).
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
