"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorySchema = exports.updateUserStatusSchema = void 0;
const zod_1 = require("zod");
exports.updateUserStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['ACTIVE', 'BANNED'], { message: 'Status must be ACTIVE or BANNED' }),
    }),
});
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Category name must be at least 2 characters'),
    }),
});
