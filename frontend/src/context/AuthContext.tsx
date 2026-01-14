"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // ✅ Client-only hydration gate
  useEffect(() => {
    setMounted(true);

    const cached = localStorage.getItem("vs_user");
    if (cached) {
      setUser(JSON.parse(cached));
    }
  }, []);

  // ✅ Firebase remains source of truth
  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const safeUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };

        setUser(firebaseUser);
        localStorage.setItem("vs_user", JSON.stringify(safeUser));
      } else {
        setUser(null);
        localStorage.removeItem("vs_user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [mounted]);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("vs_user");
    setUser(null);
  };

  // 🔒 Prevent server/client mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
