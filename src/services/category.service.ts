import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

export const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const createCategory = async (name: string) => {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    throw new AppError('Category already exists', 400);
  }
  return prisma.category.create({ data: { name } });
};