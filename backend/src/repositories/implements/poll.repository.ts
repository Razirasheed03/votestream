import { PollModel } from "../../models/implements/poll.model";
import { IPollRepository } from "../interfaces/poll.repository.interface";

export class PollRepository implements IPollRepository {
  async create(title: string, question: string, options: string[], userId: string) {
    return PollModel.create({
      title,
      question,
      options: options.map(text => ({ text })),
      createdBy: userId,
    });
  }

  async findByUser(userId: string) {
    return PollModel.find({ createdBy: userId }).sort({ createdAt: -1 });
  }

  async findActive() {
    return PollModel.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return PollModel.findById(id);
  }

  async deleteByIdAndUser(pollId: string, userId: string) {
    return PollModel.findOneAndDelete({ _id: pollId, createdBy: userId });
  }

  async updateUserVote(
    pollId: string,
    userId: string,
    newOptionId: string,
    previousOptionId?: string
  ) {
    const inc: Record<string, number> = {
      "options.$[newOpt].votes": 1,
    };

    const arrayFilters: any[] = [{ "newOpt._id": newOptionId }];

    if (previousOptionId && previousOptionId !== newOptionId) {
      inc["options.$[oldOpt].votes"] = -1;
      arrayFilters.push({ "oldOpt._id": previousOptionId });
    }

    const update: any = {
      $inc: inc,
      $set: {
        [`votesByUser.${userId}`]: newOptionId,
      },
    };

    return PollModel.findOneAndUpdate(
      { _id: pollId },
      update,
      {
        new: true,
        arrayFilters,
      }
    );
  }

  async save(poll: any) {
    return poll.save();
  }
}
