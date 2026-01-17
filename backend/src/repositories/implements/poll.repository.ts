import { IPollRepository } from "../interfaces/poll.repository.interface";
import { AnyObject as Poll } from "mongoose";
import { PollModel } from "../../models/implements/poll.model";
// import { Poll } from "../../models/poll.model"; // domain DTO (if you keep one)

export class PollRepository implements IPollRepository {
  async create(data: { question: string; options: string[] }): Promise<Poll> {
    const doc = await PollModel.create(data);

    return {
      id: doc._id.toString(),
      question: doc.question,
      options: doc.options,
      createdAt: doc.createdAt!,
    };
  }
}
