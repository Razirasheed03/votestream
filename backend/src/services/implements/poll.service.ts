import { IPollService } from "../interfaces/poll.service.interface";
import { IPollRepository } from "../../repositories/interfaces/poll.repository.interface";
import { AnyObject as Poll } from "mongoose";

export class PollService implements IPollService {
  constructor(private readonly pollRepo: IPollRepository) {}

  async createPoll(question: string, options: string[]): Promise<Poll> {
    if (!question || options.length < 2) {
      throw new Error("Poll must have a question and at least 2 options");
    }

    return this.pollRepo.create({ question, options });
  }
}
