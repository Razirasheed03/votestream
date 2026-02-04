"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollModel = void 0;
const mongoose_1 = require("mongoose");
const pollOptionSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
}, { _id: true });
const pollSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [pollOptionSchema], required: true },
    createdBy: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    votesByUser: { type: Map, of: String, default: {} },
}, { timestamps: true });
exports.PollModel = (0, mongoose_1.model)("Poll", pollSchema);
//# sourceMappingURL=poll.model.js.map