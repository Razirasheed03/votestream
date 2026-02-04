"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollService = void 0;
const AppError_1 = require("../../utils/AppError");
class PollService {
    _pollRepository;
    constructor(_pollRepository) {
        this._pollRepository = _pollRepository;
    }
    mapPollToView(poll) {
        const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
        return {
            id: poll._id.toString(),
            title: poll.title,
            question: poll.question,
            totalVotes,
            options: poll.options.map((option) => ({
                id: option._id.toString(),
                text: option.text,
                votes: option.votes,
                percentage: totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100),
            })),
        };
    }
    async createPoll(title, question, options, userId) {
        if (!title || !question || options.length < 2) {
            throw new AppError_1.AppError(400, "Invalid poll data");
        }
        return this._pollRepository.create(title, question, options, userId);
    }
    async getPollsByUser(userId) {
        return this._pollRepository.findByUser(userId);
    }
    async getActivePolls() {
        const polls = await this._pollRepository.findActive();
        return polls.map(poll => this.mapPollToView(poll));
    }
    async getPollView(pollId) {
        const poll = await this._pollRepository.findById(pollId);
        if (!poll)
            return null;
        return this.mapPollToView(poll);
    }
    async vote(pollId, optionId, userId) {
        const poll = await this._pollRepository.findById(pollId);
        if (!poll || !poll.isActive) {
            throw new AppError_1.AppError(404, "Poll not found");
        }
        const optionExists = poll.options.some(option => option._id.toString() === optionId);
        if (!optionExists) {
            throw new AppError_1.AppError(404, "Option not found");
        }
        const previousOptionId = poll.votesByUser?.get?.(userId) ?? poll.votesByUser?.[userId];
        if (previousOptionId === optionId) {
            return { success: true };
        }
        const updated = await this._pollRepository.updateUserVote(pollId, userId, optionId, previousOptionId);
        if (!updated) {
            throw new AppError_1.AppError(400, "Unable to record vote");
        }
        return { success: true };
    }
    async deletePoll(pollId, userId) {
        const deleted = await this._pollRepository.deleteByIdAndUser(pollId, userId);
        if (!deleted) {
            throw new AppError_1.AppError(404, "Poll not found");
        }
        return { success: true };
    }
}
exports.PollService = PollService;
//# sourceMappingURL=poll.service.js.map