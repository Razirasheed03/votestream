import { Router } from "express";
import { pollController } from "../dependencies/poll.di";
import { firebaseAuthMiddleware } from "../middlewares/firebaseAuth.middleware";

const router = Router();

router.post("/", firebaseAuthMiddleware, pollController.create);
router.get("/me", firebaseAuthMiddleware, pollController.listMyPolls);

export default router;
