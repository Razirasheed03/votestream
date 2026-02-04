import { IPollModel } from "../../models/interfaces/poll.model.interface";

export interface IPollRepository {
  create(title: string, question: string, options: string[], userId: string): Promise<IPollModel>;
  findByUser(userId: string): Promise<IPollModel[]>;
  findActive(): Promise<IPollModel[]>;
  findById(id: string): Promise<IPollModel | null>;
  deleteByIdAndUser(pollId: string, userId: string): Promise<IPollModel | null>;
  updateUserVote(
    pollId: string,
    userId: string,
    newOptionId: string,
    previousOptionId?: string
  ): Promise<IPollModel | null>;
  save(poll: IPollModel): Promise<IPollModel>;
}
