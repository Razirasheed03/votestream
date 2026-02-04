import { Schema, model } from "mongoose";
import { IPollModel, IPollOption } from "../interfaces/poll.model.interface";

const pollOptionSchema = new Schema<IPollOption>(
  {
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
  },
  { _id: true }
);

const pollSchema = new Schema<IPollModel>(
  {
    title: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [pollOptionSchema], required: true },
    createdBy: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    votesByUser: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

export const PollModel = model<IPollModel>("Poll", pollSchema);
