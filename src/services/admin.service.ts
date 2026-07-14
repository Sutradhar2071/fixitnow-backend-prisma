import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

export const getAllUsers = async (role?: string) => {
  const where: any = {};
  if (role) where.role = role;

  return prisma.user.findMany({
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

export const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'BANNED') => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'ADMIN') throw new AppError('Cannot change status of an admin', 400);

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, status: true },
  });
};

export const getAllBookings = async (status?: string) => {
  const where: any = {};
  if (status) where.status = status;

  return prisma.booking.findMany({
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