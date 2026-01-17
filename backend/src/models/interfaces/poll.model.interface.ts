import { Document, Types } from "mongoose";

export interface IPollOption {
  _id: Types.ObjectId;
  text: string;
  votes: number;
}

export interface IPollModel extends Document {
  question: string;
  options: IPollOption[];
  createdBy: string;
  isActive: boolean;
  votesByUser?: Map<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}
