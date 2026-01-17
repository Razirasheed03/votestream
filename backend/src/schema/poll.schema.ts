import { Schema, model } from "mongoose";
import { IPollModel } from "../models/interfaces/poll.model.interface";

const PollSchema = new Schema<IPollModel>(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: "At least 2 options are required",
      },
    },
  },
  { timestamps: true }
);

export const Poll = model<IPollModel>("Poll", PollSchema);
