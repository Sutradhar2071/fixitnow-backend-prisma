"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookings = exports.updateUserStatus = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const getAllUsers = async (role) => {
    const where = {};
    if (role)
        where.role = role;
    return prisma_1.default.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getAllUsers = getAllUsers;
const updateUserStatus = async (userId, status) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new AppError_1.AppError('User not found', 404);
    if (user.role === 'ADMIN')
        throw new AppError_1.AppError('Cannot change status of an admin', 400);
    return prisma_1.default.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, status: true },
    });
};
exports.updateUserStatus = updateUserStatus;
const getAllBookings = async (status) => {
    const where = {};
    if (status)
        where.status = status;
    return prisma_1.default.booking.findMany({
        where,
        include: {
            customer: { select: { name: true, email: true } },
            technician: { include: { user: { select: { name: true, email: true } } } },
            service: true,
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getAllBookings = getAllBookings;
