import type { Response } from "express";

export class ResponseHelper {
  static ok<T>(res: Response, data: T, message?: string): Response {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message?: string): Response {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, statusCode: number, message: string): Response {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
