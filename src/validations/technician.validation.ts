import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experience: z.number().int().min(0).optional(),
    location: z.string().optional(),
  }),
});

export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    categoryId: z.string().uuid('Invalid category id'),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

export const setAvailabilitySchema = z.object({
  body: z.object({
    slots: z.array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, use HH:MM'),
        endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, use HH:MM'),
      })
    ).min(1, 'At least one slot required'),
  }),
});