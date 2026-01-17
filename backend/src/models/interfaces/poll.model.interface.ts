import { Document, Types } from "mongoose";

export interface IPollModel extends Document {
  question: string;
  options: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
