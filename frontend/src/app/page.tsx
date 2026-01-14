"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { signInWithGoogle } from "../lib/auth";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      alert("Google sign-in failed");
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-emerald-400/15 to-transparent rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />

   <Navbar/>

      {/* HERO */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur border border-green-200 rounded-full shadow">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">
                Lightning Fast • Real-Time
              </span>
            </span>

            <h2 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="text-gray-900">Poll & Chat</span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                In Real-Time
              </span>
            </h2>

            <p className="text-lg text-gray-600 max-w-xl">
              Create instant polls, gather opinions, and chat with your audience
              simultaneously in one beautiful interface.
            </p>

            <div className="flex gap-4">
{
  !user ? (
  <button
    onClick={handleGoogleSignIn}
    disabled={loading}
    className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-bold shadow-xl disabled:opacity-60"
  >
    {loading ? "Signing in..." : "Get Started with Google"}
  </button>
) : (
  <button className="px-10 py-5 bg-green-600 text-white rounded-2xl font-bold shadow-xl">
    Go to Dashboard
  </button>
)
}


              <button className="px-10 py-5 bg-white border-2 border-green-300 rounded-2xl font-bold hover:bg-green-50 transition">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              {["Fast", "Secure", "Live"].map((label) => (
                <div
                  key={label}
                  className="bg-white/60 backdrop-blur border border-white rounded-2xl p-4 text-center hover:scale-105 transition"
                >
                  <div className="text-2xl font-black text-green-600">
                    {label}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-1">
                    Real-Time
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – Preview Cards */}
          <div className="space-y-6">

            {/* Poll Card */}
            <div className="bg-white/70 backdrop-blur border border-white rounded-3xl p-8 shadow-2xl hover:-translate-y-1 transition">
              <h3 className="text-xl font-bold mb-4">
                What feature do you like most?
              </h3>

              {[
                { label: "Real-Time Polling", value: 45 },
                { label: "Live Chat", value: 30 },
                { label: "Both", value: 25 },
              ].map((opt) => (
                <div key={opt.label} className="mb-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{opt.label}</span>
                    <span className="text-green-600">{opt.value}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${opt.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Card */}
            <div className="bg-white/70 backdrop-blur border border-white rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Live Chat</span>
                <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">
                  3 online
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  This looks amazing! 🚀
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-3 text-sm self-end">
                  Glad you like it! 💫
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
