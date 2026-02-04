// backend/src/controllers/interfaces/IPollController.ts
import { Request, Response, NextFunction } from "express";

export interface IPollController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  listMyPolls(req: Request, res: Response, next: NextFunction): Promise<void>;
  getActivePolls(req: Request, res: Response, next: NextFunction): Promise<void>;
  vote(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
