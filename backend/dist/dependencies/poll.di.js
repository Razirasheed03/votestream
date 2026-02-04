"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollController = exports.pollService = void 0;
const poll_controller_1 = require("../controllers/implements/poll.controller");
const poll_repository_1 = require("../repositories/implements/poll.repository");
const poll_service_1 = require("../services/implements/poll.service");
exports.pollService = new poll_service_1.PollService(new poll_repository_1.PollRepository());
exports.pollController = new poll_controller_1.PollController(exports.pollService);
//# sourceMappingURL=poll.di.js.map