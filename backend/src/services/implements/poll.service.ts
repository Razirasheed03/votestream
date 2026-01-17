import { IPollService } from "../interfaces/poll.service.interface";
import { PollRepository } from "../../repositories/implements/poll.repository";

export class PollService implements IPollService {
  constructor(
    private readonly _pollRepository: PollRepository
  ) {}

  async createPoll(
    question: string,
    options: string[],
    userId: string
  ) {
    if (!question || options.length < 2) {
      throw new Error("Invalid poll data");
    }

    return this._pollRepository.create(
      question,
      options,
      userId
    );
  }

  async getPollsByUser(userId: string) {
    return this._pollRepository.findByUser(userId);
  }
}
