"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static ok(res, data, message) {
        return res.status(200).json({
            success: true,
            message,
            data,
        });
    }
    static created(res, data, message) {
        return res.status(201).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, statusCode, message) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
}
exports.ResponseHelper = ResponseHelper;
//# sourceMappingURL=ResponseHelper.js.map