// frontend/src/lib/auth.ts
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export async function signInWithGoogle() {
  try {
    console.log("🔐 Initiating Google sign-in...");
    
    // ✅ Set custom parameters to avoid COOP issues
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    
    console.log("✅ Google sign-in successful");
    console.log(`   User: ${result.user.email}`);
    console.log(`   UID: ${result.user.uid}`);
    
    return result.user;
  } catch (error: any) {
    console.error("❌ Google sign-in failed:", error);
    
    // Provide more helpful error messages
    if (error.code === "auth/popup-blocked") {
      throw new Error("Popup was blocked. Please allow popups for this site.");
    } else if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled.");
    } else if (error.code === "auth/cancelled-popup-request") {
      throw new Error("Multiple popup requests detected. Please try again.");
    }
    
    throw error;
  }
}