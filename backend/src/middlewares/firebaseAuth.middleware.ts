// backend/src/middlewares/firebaseAuth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";
import { AppError } from "../utils/AppError";

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("❌ Auth: No authorization header");
      return next(new AppError(401, "Authorization token missing"));
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Auth: Invalid authorization format");
      return next(new AppError(401, "Invalid authorization format"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("❌ Auth: Token is empty");
      return next(new AppError(401, "Token is empty"));
    }

    console.log(`🔐 Auth: Verifying token...`);
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    console.log(`✅ Auth: Token verified for user ${decodedToken.uid}`);
    req.user = decodedToken;
    (req as any).userId = decodedToken.uid;
    return next();
  } catch (error) {
    console.error("❌ Auth: Token verification failed:", error);
    return next(new AppError(401, "Invalid or expired token"));
  }
};