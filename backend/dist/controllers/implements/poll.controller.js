"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollController = void 0;
const AppError_1 = require("../../utils/AppError");
class PollController {
    _pollService;
    constructor(_pollService) {
        this._pollService = _pollService;
    }
    create = async (req, res, next) => {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { title, question, options } = req.body;
            const poll = await this._pollService.createPoll(title, question, options, userId);
            res.status(201).json({
                success: true,
                data: poll,
            });
        }
        catch (err) {
            next(err);
        }
    };
    listMyPolls = async (req, res, next) => {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const polls = await this._pollService.getPollsByUser(userId);
            res.status(200).json({
                success: true,
                data: { polls },
            });
        }
        catch (err) {
            next(err);
        }
    };
    getActivePolls = async (_req, res, next) => {
        try {
            const polls = await this._pollService.getActivePolls();
            res.status(200).json({
                success: true,
                data: polls,
            });
        }
        catch (err) {
            next(err);
        }
    };
    vote = async (req, res, next) => {
        try {
            const pollId = Array.isArray(req.params.pollId) ? req.params.pollId[0] : req.params.pollId;
            const optionId = Array.isArray(req.params.optionId) ? req.params.optionId[0] : req.params.optionId;
            const userId = req.userId;
            if (!userId) {
                throw new AppError_1.AppError(401, "Unauthorized");
            }
            const result = await this._pollService.vote(pollId, optionId, userId);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const pollId = Array.isArray(req.params.pollId) ? req.params.pollId[0] : req.params.pollId;
            const userId = req.userId;
            if (!userId) {
                throw new AppError_1.AppError(401, "Unauthorized");
            }
            const result = await this._pollService.deletePoll(pollId, userId);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    };
}
exports.PollController = PollController;
//# sourceMappingURL=poll.controller.js.map