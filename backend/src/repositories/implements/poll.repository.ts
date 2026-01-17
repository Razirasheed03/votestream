import { PollModel } from "../../schema/poll.schema";

export class PollRepository {
  async create(
    question: string,
    options: string[],
    userId: string
  ) {
    return PollModel.create({
      question,
      options,
      createdBy: userId,
    });
  }

  async findByUser(userId: string) {
    return PollModel.find({ createdBy: userId }).sort({ createdAt: -1 });
  }
}
