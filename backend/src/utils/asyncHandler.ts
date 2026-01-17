import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = <
  Req = Request,
  Res = Response,
  Next = NextFunction
>(
  fn: (req: Req, res: Res, next: Next) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(fn(req as unknown as Req, res as unknown as Res, next as unknown as Next)).catch(
      next
    );
  };
};
