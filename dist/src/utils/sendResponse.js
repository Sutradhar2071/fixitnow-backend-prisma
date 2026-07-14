"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: true,
        message,
        data: data ?? null,
    });
};
exports.sendResponse = sendResponse;
