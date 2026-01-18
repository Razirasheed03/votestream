import { PollController } from "../controllers/implements/poll.controller";
import { PollRepository } from "../repositories/implements/poll.repository";
import { PollService } from "../services/implements/poll.service";

export const pollService = new PollService(
  new PollRepository()
);

export const pollController = new PollController(pollService);
