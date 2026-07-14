"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        serviceId: zod_1.z.string().uuid('Invalid service id'),
        scheduledAt: zod_1.z.string().datetime({ message: 'Invalid date format (use ISO string)' }),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updateBookingStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED'], {
            message: 'Invalid status value',
        }),
    }),
});
