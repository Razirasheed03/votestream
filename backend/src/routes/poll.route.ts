import { Router } from "express";
import { pollController } from "../dependencies/poll.di";

const router = Router();

router.post("/", (req, res, next) =>
  pollController.create(req, res, next)
);

export default router;
