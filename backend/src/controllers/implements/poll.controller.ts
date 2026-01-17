import { Request, Response, NextFunction } from "express";
import { IPollService } from "../../services/interfaces/poll.service.interface";

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
}
