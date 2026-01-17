import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
