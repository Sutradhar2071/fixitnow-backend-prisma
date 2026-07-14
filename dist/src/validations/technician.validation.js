"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAvailabilitySchema = exports.updateServiceSchema = exports.createServiceSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        bio: zod_1.z.string().optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        experience: zod_1.z.number().int().min(0).optional(),
        location: zod_1.z.string().optional(),
    }),
});
exports.createServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2, 'Title must be at least 2 characters'),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive('Price must be positive'),
        categoryId: zod_1.z.string().uuid('Invalid category id'),
    }),
});
exports.updateServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2).optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        categoryId: zod_1.z.string().uuid().optional(),
    }),
});
exports.setAvailabilitySchema = zod_1.z.object({
    body: zod_1.z.object({
        slots: zod_1.z.array(zod_1.z.object({
            dayOfWeek: zod_1.z.number().int().min(0).max(6),
            startTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, use HH:MM'),
            endTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, use HH:MM'),
        })).min(1, 'At least one slot required'),
    }),
});
