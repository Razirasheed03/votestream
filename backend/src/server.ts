import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDatabase } from "./config/mongodb";
import pollRouter from "./routes/poll.route";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

/**
 * ✅ ABSOLUTE FIRST: CORS
 * This MUST be before everything else
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

/**
 * ✅ ABSOLUTE SECOND: OPTIONS SHORT-CIRCUIT
 * Guarantees preflight never falls through
 */
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

app.options(/.*/, (_req, res) => {
  res.sendStatus(204);
});

/**
 * Body parsers AFTER preflight handling
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

/**
 * Routes
 */
app.use("/api/polls", pollRouter);

/**
 * Error handler
 */
app.use(errorMiddleware);

/**
 * 404
 */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/**
 * Start server AFTER DB
 */
connectDatabase().then(() => {
  app.listen(env.PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
  });
});
