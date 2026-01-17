import { IPollController } from "../interfaces/poll.controller.interface";
import { IPollService } from "../../services/interfaces/poll.service.interface";
import { Request, Response, NextFunction } from "express";

export class PollController implements IPollController {
  constructor(private readonly pollService: IPollService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { question, options } = req.body;

      const poll = await this.pollService.createPoll(question, options);

      res.status(201).json({
        success: true,
        data: poll,
      });
    } catch (error) {
      next(error);
    }
  }
}
