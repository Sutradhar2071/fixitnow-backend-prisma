"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const registerUser = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new AppError_1.AppError('Email already registered', 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            role: data.role,
        },
    });
    // If technician, auto-create empty profile
    if (data.role === 'TECHNICIAN') {
        await prisma_1.default.technicianProfile.create({
            data: { userId: user.id },
        });
    }
    const token = (0, jwt_1.signToken)({ id: user.id, role: user.role });
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    if (user.status === 'BANNED') {
        throw new AppError_1.AppError('Your account has been banned', 403);
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    const token = (0, jwt_1.signToken)({ id: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.loginUser = loginUser;
const getCurrentUser = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        include: { technicianProfile: true },
    });
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.getCurrentUser = getCurrentUser;
