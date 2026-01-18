import { IPollService, PollView } from "../interfaces/poll.service.interface";
import { IPollRepository } from "../../repositories/interfaces/poll.repository.interface";
import { AppError } from "../../utils/AppError";

export class PollService implements IPollService {
  constructor(
    private readonly _pollRepository: IPollRepository
  ) {}

  private mapPollToView(poll: any): PollView {
    const totalVotes = poll.options.reduce((sum: number, option: any) => sum + (option.votes || 0), 0);

    return {
      id: poll._id.toString(),
      title: poll.question,
      question: poll.question,
      totalVotes,
      options: poll.options.map((option: any) => ({
        id: option._id.toString(),
        text: option.text,
        votes: option.votes,
        percentage: totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100),
      })),
    };
  }

  async createPoll(
    question: string,
    options: string[],
    userId: string
  ) {
    if (!question || options.length < 2) {
      throw new AppError(400, "Invalid poll data");
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

  async getActivePolls(): Promise<PollView[]> {
    const polls = await this._pollRepository.findActive();

    return polls.map(poll => this.mapPollToView(poll));
  }

  async getPollView(pollId: string): Promise<PollView | null> {
    const poll = await this._pollRepository.findById(pollId);
    if (!poll) return null;
    return this.mapPollToView(poll);
  }

  async vote(pollId: string, optionId: string, userId: string): Promise<{ success: true }> {
    const poll = await this._pollRepository.findById(pollId);

    if (!poll || !poll.isActive) {
      throw new AppError(404, "Poll not found");
    }

    const optionExists = poll.options.some(option => option._id.toString() === optionId);
    if (!optionExists) {
      throw new AppError(404, "Option not found");
    }

    const previousOptionId =
      (poll.votesByUser as any)?.get?.(userId) ?? (poll.votesByUser as any)?.[userId];

    if (previousOptionId === optionId) {
      return { success: true };
    }

    const updated = await this._pollRepository.updateUserVote(
      pollId,
      userId,
      optionId,
      previousOptionId
    );

    if (!updated) {
      throw new AppError(400, "Unable to record vote");
    }

    return { success: true };
  }
}
