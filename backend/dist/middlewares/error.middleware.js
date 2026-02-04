"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("../utils/AppError");
const errorMiddleware = (err, _req, res, _next) => {
    const statusCode = err instanceof AppError_1.AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map