// backend/src/config/mongodb.ts
import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    console.log("ℹ️ MongoDB already connected");
    return;
  }

  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
      isConnected = true;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
      isConnected = false;
    });

    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10_000,
    });
  } catch (error) {
    console.error("❌ Failed to connect MongoDB:", error);
    process.exit(1);
  }
};
