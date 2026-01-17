import { Schema, model, Document } from "mongoose";

export interface PollDocument extends Document {
  question: string;
  options: string[];
  createdBy: string; // firebase uid
  createdAt: Date;
}

const pollSchema = new Schema<PollDocument>(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: [(v: string[]) => v.length >= 2, "At least 2 options required"],
    },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const PollModel = model<PollDocument>("Poll", pollSchema);
