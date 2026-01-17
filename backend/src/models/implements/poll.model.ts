import { Model } from "mongoose";

import { Poll } from "../../schema/poll.schema";
import { IPollModel } from "../interfaces/poll.model.interface";

export const PollModel: Model<IPollModel> = Poll;
