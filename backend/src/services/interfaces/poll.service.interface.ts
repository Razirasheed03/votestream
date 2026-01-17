import { AnyObject as Poll } from "mongoose";

export interface IPollService {
  createPoll(question: string, options: string[]): Promise<Poll>;
}
