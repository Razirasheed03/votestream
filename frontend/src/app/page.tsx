"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { signInWithGoogle } from "../lib/auth";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      alert("Google sign-in failed");
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* HERO */}
      <main className="max-w-7xl mx-auto px-6">
        <section className="py-8 grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div className="space-y-10 self-start">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold tracking-tight leading-tight">
                Real-time
                <br />
                audience engagement
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                A secure platform for conducting live polls and discussions.
                Designed for reliability, clarity, and real-time feedback
                without distractions.
              </p>
            </div>

            <div className="flex gap-4">
              {!user ? (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="px-8 py-4 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Sign in with Google"}
                </button>
              ) : (
      <button
  type="button"
  onClick={goToDashboard}
  className="group inline-flex items-center gap-3
             px-7 py-3.5 rounded-full
             bg-slate-900 text-white
             font-medium
             transition-all duration-200
             hover:bg-slate-800
             hover:-translate-y-0.5
             active:translate-y-0
             shadow-md hover:shadow-lg"
>
  <span>
    Go to dashboard
  </span>

  <svg
    className="w-8 h-8 p-2 rounded-full
               bg-white text-slate-900
               transition-transform duration-200
               rotate-45 group-hover:rotate-90"
    viewBox="0 0 16 19"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
      className="fill-current"
    />
  </svg>
</button>

              )}
            </div>

            {/* TRUST STRIP */}
            <div className="pt-10 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4">
                Designed for professional environments
              </p>
              <div className="grid grid-cols-3 gap-10 text-sm">
                <div>
                  <p className="font-semibold">Low latency</p>
                  <p className="text-slate-500">
                    Real-time updates without refresh.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Secure authentication</p>
                  <p className="text-slate-500">
                    OAuth-based Google login.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Scalable sessions</p>
                  <p className="text-slate-500">
                    Built to handle live audiences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
<div className="flex items-center  self-center mt-12">
  <div className="w-full space-y-8">

    {/* TITLE */}
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Product workflow
      </p>
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
        How the platform works
      </h3>
    </div>

    {/* FLOW LIST */}
    <div className="space-y-4">

      {[
        {
          title: "Create a poll",
          desc: "Authenticated users create polls with multiple options and session rules."
        },
        {
          title: "Start a room / session",
          desc: "Polls run inside live sessions where participants join in real time."
        },
        {
          title: "Live voting",
          desc: "Votes are submitted instantly and aggregated without page refresh."
        },
        {
          title: "Live chat",
          desc: "Participants communicate during sessions through real-time messaging."
        },
        {
          title: "View results & analytics",
          desc: "Poll outcomes and participation data are available after the session."
        },
        {
          title: "Dashboard access",
          desc: "Users manage polls, sessions, and historical results from their dashboard."
        }
      ].map((item, index) => (
        <div
          key={item.title}
          className="flex gap-5"
        >
          {/* STEP */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full border border-slate-400 text-sm flex items-center justify-center font-medium text-slate-700">
              {index + 1}
            </div>
            {index !== 5 && (
              <div className="h-full w-px bg-slate-200 mt-1" />
            )}
          </div>

          {/* CONTENT */}
          <div className="pb-6">
            <p className="font-semibold text-slate-900">
              {item.title}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              {item.desc}
            </p>
          </div>
        </div>
      ))}

    </div>

  </div>
</div>



        </section>

       {/* SECONDARY SECTION */}
<section className="py-10 border-t border-slate-200">
  <div className="max-w-3xl mx-auto text-center space-y-4">

    <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
      Built for clarity, not noise
    </h2>

    <p className="text-slate-600 leading-relaxed text-lg">
      The platform is intentionally restrained. Every interaction is
      predictable, purposeful, and optimized for live collaboration
      environments including meetings, classrooms, workshops, and events.
    </p>

  </div>
</section>

      </main>
    </div>
  );
}
