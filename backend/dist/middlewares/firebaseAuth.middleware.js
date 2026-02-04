"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuthMiddleware = void 0;
const firebase_1 = require("../config/firebase");
const AppError_1 = require("../utils/AppError");
const firebaseAuthMiddleware = async (req, res, next) => {
    try {
        if (req.method === "OPTIONS") {
            return next();
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("❌ Auth: No authorization header");
            return next(new AppError_1.AppError(401, "Authorization token missing"));
        }
        if (!authHeader.startsWith("Bearer ")) {
            console.log("❌ Auth: Invalid authorization format");
            return next(new AppError_1.AppError(401, "Invalid authorization format"));
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log("❌ Auth: Token is empty");
            return next(new AppError_1.AppError(401, "Token is empty"));
        }
        console.log(`🔐 Auth: Verifying token...`);
        const decodedToken = await firebase_1.firebaseAdmin.auth().verifyIdToken(token);
        console.log(`✅ Auth: Token verified for user ${decodedToken.uid}`);
        req.user = decodedToken;
        req.userId = decodedToken.uid;
        return next();
    }
    catch (error) {
        console.error("❌ Auth: Token verification failed:", error);
        return next(new AppError_1.AppError(401, "Invalid or expired token"));
    }
};
exports.firebaseAuthMiddleware = firebaseAuthMiddleware;
//# sourceMappingURL=firebaseAuth.middleware.js.map