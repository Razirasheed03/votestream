"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollRepository = void 0;
const poll_model_1 = require("../../models/implements/poll.model");
class PollRepository {
    async create(title, question, options, userId) {
        return poll_model_1.PollModel.create({
            title,
            question,
            options: options.map(text => ({ text })),
            createdBy: userId,
        });
    }
    async findByUser(userId) {
        return poll_model_1.PollModel.find({ createdBy: userId }).sort({ createdAt: -1 });
    }
    async findActive() {
        return poll_model_1.PollModel.find({ isActive: true }).sort({ createdAt: -1 });
    }
    async findById(id) {
        return poll_model_1.PollModel.findById(id);
    }
    async deleteByIdAndUser(pollId, userId) {
        return poll_model_1.PollModel.findOneAndDelete({ _id: pollId, createdBy: userId });
    }
    async updateUserVote(pollId, userId, newOptionId, previousOptionId) {
        const inc = {
            "options.$[newOpt].votes": 1,
        };
        const arrayFilters = [{ "newOpt._id": newOptionId }];
        if (previousOptionId && previousOptionId !== newOptionId) {
            inc["options.$[oldOpt].votes"] = -1;
            arrayFilters.push({ "oldOpt._id": previousOptionId });
        }
        const update = {
            $inc: inc,
            $set: {
                [`votesByUser.${userId}`]: newOptionId,
            },
        };
        return poll_model_1.PollModel.findOneAndUpdate({ _id: pollId }, update, {
            new: true,
            arrayFilters,
        });
    }
    async save(poll) {
        return poll.save();
    }
}
exports.PollRepository = PollRepository;
//# sourceMappingURL=poll.repository.js.map