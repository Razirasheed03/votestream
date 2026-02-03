"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signInWithGoogle } from "@/lib/auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
    setShowUserMenu(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      alert("Google sign-in failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LEFT — BRAND */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">
              V
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-extrabold text-slate-900">
                VoteStream
              </h1>
              <p className="text-xs text-slate-500">
                Real-time engagement
              </p>
            </div>
          </div>

          {/* RIGHT — ACTIONS */}
          {!user ? (
            <button
              onClick={handleGoogleSignIn}
              className="px-6 py-2.5 rounded-full
                         bg-slate-900 text-white
                         text-sm font-medium
                         hover:bg-slate-800
                         transition shadow-sm"
            >
              Get started
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-3 px-3 py-2 rounded-full
                           hover:bg-slate-100 transition"
              >
                {/* AVATAR */}
                <div className="relative w-9 h-9">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-9 h-9 rounded-full border border-slate-300 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}

                  <div className="absolute inset-0 flex items-center justify-center
                                  rounded-full bg-slate-900 text-white
                                  text-sm font-semibold">
                    {(user.displayName || "U").charAt(0).toUpperCase()}
                  </div>
                </div>

                <svg
                  className={`w-4 h-4 text-slate-600 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-60
                                rounded-xl bg-white
                                border border-slate-200
                                shadow-xl overflow-hidden">

                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* DASHBOARD */}
                  <button
                    onClick={goToDashboard}
                    className="w-full px-4 py-3
                               text-sm text-left
                               hover:bg-slate-100
                               transition flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-md
                                     bg-slate-900 text-white
                                     flex items-center justify-center
                                     text-xs">
                      D
                    </span>
                    Dashboard
                  </button>

                  <div className="border-t border-slate-200" />

                  {/* LOGOUT */}
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3
                               text-sm text-left text-red-600
                               hover:bg-red-50
                               transition flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-md
                                     bg-red-100
                                     flex items-center justify-center
                                     text-xs">
                      ⎋
                    </span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
