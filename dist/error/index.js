"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const handleError = (err, req, res) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: err.message });
};
exports.handleError = handleError;
