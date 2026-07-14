"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getAllCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const getAllCategories = async () => {
    return prisma_1.default.category.findMany({ orderBy: { name: 'asc' } });
};
exports.getAllCategories = getAllCategories;
const createCategory = async (name) => {
    const existing = await prisma_1.default.category.findUnique({ where: { name } });
    if (existing) {
        throw new AppError_1.AppError('Category already exists', 400);
    }
    return prisma_1.default.category.create({ data: { name } });
};
exports.createCategory = createCategory;
