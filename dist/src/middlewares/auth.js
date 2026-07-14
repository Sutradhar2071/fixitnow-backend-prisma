"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../config/prisma"));
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.AppError('You are not logged in. Please login to access.', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            throw new AppError_1.AppError('User belonging to this token no longer exists', 401);
        }
        if (user.status === 'BANNED') {
            throw new AppError_1.AppError('Your account has been banned', 403);
        }
        req.user = { id: user.id, role: user.role };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
