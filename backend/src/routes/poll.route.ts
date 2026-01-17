import { Router } from "express";
import { pollController } from "../dependencies/poll.di";
import { firebaseAuthMiddleware } from "../middlewares/firebaseAuth.middleware";

const router = Router();

router.get("/active", pollController.getActivePolls);
router.post("/:pollId/vote/:optionId", firebaseAuthMiddleware, pollController.vote);

router.post("/", firebaseAuthMiddleware, pollController.create);
router.get("/me", firebaseAuthMiddleware, pollController.listMyPolls);

export default router;
