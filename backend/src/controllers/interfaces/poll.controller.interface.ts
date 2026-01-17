// backend/src/controllers/interfaces/IPollController.ts
import { Request, Response, NextFunction } from "express";

export interface IPollController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
}
