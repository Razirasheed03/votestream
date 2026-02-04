"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollModel = void 0;
const mongoose_1 = require("mongoose");
const pollSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    options: {
        type: [String],
        required: true,
        validate: [(v) => v.length >= 2, "At least 2 options required"],
    },
    createdBy: { type: String, required: true },
}, { timestamps: true });
exports.PollModel = (0, mongoose_1.model)("Poll", pollSchema);
//# sourceMappingURL=poll.schema.js.map