// backend/src/dependencies/poll.di.ts
import { PollRepository } from "../repositories/implements/poll.repository";
import { PollService } from "../services/implements/poll.service";
import { PollController } from "../controllers/implements/poll.controller";

const pollRepository = new PollRepository();
const pollService = new PollService(pollRepository);
const pollController = new PollController(pollService);

export { pollController };
