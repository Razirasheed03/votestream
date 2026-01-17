import { Request, Response, NextFunction } from "express";
import { IPollService } from "../../services/interfaces/poll.service.interface";
import { AppError } from "../../utils/AppError";

export class PollController {
  constructor(
    private readonly _pollService: IPollService
  ) {}

  create = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { question, options } = req.body;

      const poll = await this._pollService.createPoll(
        question,
        options,
        userId
      );

      res.status(201).json({
        success: true,
        data: poll,
      });
    } catch (err) {
      next(err);
    }
  };

  listMyPolls = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const polls = await this._pollService.getPollsByUser(userId);

      res.status(200).json({
        success: true,
        data: { polls },
      });
    } catch (err) {
      next(err);
    }
  };

  getActivePolls = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const polls = await this._pollService.getActivePolls();

      res.status(200).json({
        success: true,
        data: polls,
      });
    } catch (err) {
      next(err);
    }
  };

  vote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pollId = Array.isArray(req.params.pollId) ? req.params.pollId[0] : req.params.pollId;
      const optionId = Array.isArray(req.params.optionId) ? req.params.optionId[0] : req.params.optionId;

      const userId = (req as any).userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized");
      }

      const result = await this._pollService.vote(pollId, optionId, userId);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
