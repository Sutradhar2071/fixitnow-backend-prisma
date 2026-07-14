import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.string().uuid('Invalid service id'),
    scheduledAt: z.string().datetime({ message: 'Invalid date format (use ISO string)' }),
    notes: z.string().optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED'], {
      message: 'Invalid status value',
    }),
  }),
});