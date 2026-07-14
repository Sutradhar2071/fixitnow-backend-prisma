import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'BANNED'], { message: 'Status must be ACTIVE or BANNED' }),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
  }),
});