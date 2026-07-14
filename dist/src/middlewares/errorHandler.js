"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorDetails = err?.message || null;
    // Custom AppError
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errorDetails ?? err.message;
    }
    // Zod validation error
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        errorDetails = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
    }
    // Prisma known errors (e.g. unique constraint)
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;
        if (err.code === 'P2002') {
            message = `Duplicate value for field: ${err.meta?.target}`;
        }
        else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Record not found';
        }
        else {
            message = 'Database error';
        }
        errorDetails = err.message;
    }
    // JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};
exports.globalErrorHandler = globalErrorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        errorDetails: null,
    });
};
exports.notFoundHandler = notFoundHandler;
