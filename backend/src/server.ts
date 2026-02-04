import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { env } from "./config/env";
import { connectDatabase } from "./config/mongodb";
import pollRouter from "./routes/poll.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { initializeSocketServer } from "./sockets";

/* ---------------- CORS CONFIG ---------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "https://votestreampolls.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server, curl, etc.
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

/* ---------------- APP SETUP ---------------- */

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions,
});

/* ---------------- MIDDLEWARE ORDER ---------------- */

// 1️⃣ CORS must be first
app.use(cors(corsOptions));

// 2️⃣ Preflight safety
app.options(/.*/, (_req, res) => {
  res.sendStatus(204);
});

// 3️⃣ Logger (debug only)
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// 4️⃣ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ---------------- ROUTES ---------------- */

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/polls", pollRouter);

/* ---------------- ERRORS ---------------- */

app.use(errorMiddleware);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ---------------- START SERVER ---------------- */

connectDatabase().then(() => {
  initializeSocketServer(io);

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 Backend running on ${env.PORT}`);
  });
});
