"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const poll_di_1 = require("../dependencies/poll.di");
const firebaseAuth_middleware_1 = require("../middlewares/firebaseAuth.middleware");
const router = (0, express_1.Router)();
router.get("/active", poll_di_1.pollController.getActivePolls);
router.post("/:pollId/vote/:optionId", firebaseAuth_middleware_1.firebaseAuthMiddleware, poll_di_1.pollController.vote);
router.post("/", firebaseAuth_middleware_1.firebaseAuthMiddleware, poll_di_1.pollController.create);
router.get("/me", firebaseAuth_middleware_1.firebaseAuthMiddleware, poll_di_1.pollController.listMyPolls);
router.delete("/:pollId", firebaseAuth_middleware_1.firebaseAuthMiddleware, poll_di_1.pollController.delete);
exports.default = router;
//# sourceMappingURL=poll.route.js.map