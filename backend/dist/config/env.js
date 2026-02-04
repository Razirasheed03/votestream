"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = [
    "MONGO_URI",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
    throw new Error(`❌ Missing environment variables: ${missing.join(", ")}`);
}
exports.env = {
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URI: process.env.MONGO_URI,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};
//# sourceMappingURL=env.js.map