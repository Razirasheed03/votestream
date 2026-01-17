import { Document } from "mongoose";

export interface IPollModel extends Document {
  question: string;
  options: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
