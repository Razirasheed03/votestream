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
    <nav className="relative z-50 px-6 py-5">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl px-6 py-4 shadow-lg">
          <div className="flex justify-between items-center">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                ⚡
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  VoteStream
                </h1>
                <p className="text-xs text-gray-500">
                  Real-time engagement
                </p>
              </div>
            </div>

            {/* CTA */}
            {!user ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Get Started
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleUserMenu}
                  className="flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-xl border border-green-200 rounded-xl hover:shadow-lg transition"
                >
                  <img
                    src={user.photoURL || "/avatar-placeholder.png"}
                    alt={user.displayName || "User"}
                    className="w-9 h-9 rounded-lg border border-green-400"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-green-600">
                      {user.email}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-green-600 transition-transform ${
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
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur border border-green-200 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-5 py-4 border-b border-green-100">
                      <p className="text-sm font-bold">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={goToDashboard}
                      className="w-full px-5 py-3 text-left text-sm hover:bg-green-50 transition flex items-center gap-3"
                    >
                      <span className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center">
                        🏠
                      </span>
                      Dashboard
                    </button>

                    <div className="border-t border-green-100" />

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full px-5 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                    >
                      <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
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
      </div>
    </nav>
  );
}
