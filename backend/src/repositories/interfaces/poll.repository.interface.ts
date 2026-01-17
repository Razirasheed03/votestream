import { AnyObject as Poll } from "mongoose";

export interface IPollRepository {
  create(data: Omit<Poll, "id" | "createdAt">): Promise<Poll>;
}
