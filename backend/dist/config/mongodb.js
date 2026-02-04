"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
// backend/src/config/mongodb.ts
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
let isConnected = false;
const connectDatabase = async () => {
    if (isConnected) {
        console.log("ℹ️ MongoDB already connected");
        return;
    }
    try {
        mongoose_1.default.connection.on("connected", () => {
            console.log("✅ MongoDB connected");
            isConnected = true;
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
            isConnected = false;
        });
        await mongoose_1.default.connect(env_1.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10_000,
        });
    }
    catch (error) {
        console.error("❌ Failed to connect MongoDB:", error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=mongodb.js.map