"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const mongodb_1 = require("./config/mongodb");
const poll_route_1 = __importDefault(require("./routes/poll.route"));
const error_middleware_1 = require("./middlewares/error.middleware");
const sockets_1 = require("./sockets");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false,
    },
});
/**
 * ✅ ABSOLUTE FIRST: CORS
 * This MUST be before everything else
 */
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
}));
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/**
 * Health check
 */
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
/**
 * Routes
 */
app.use("/api/polls", poll_route_1.default);
/**
 * Error handler
 */
app.use(error_middleware_1.errorMiddleware);
/**
 * 404
 */
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
/**
 * Start server AFTER DB
 */
(0, mongodb_1.connectDatabase)().then(() => {
    (0, sockets_1.initializeSocketServer)(io);
    httpServer.listen(env_1.env.PORT, () => {
        console.log(`🚀 Backend running on http://localhost:${env_1.env.PORT}`);
    });
});
//# sourceMappingURL=server.js.map