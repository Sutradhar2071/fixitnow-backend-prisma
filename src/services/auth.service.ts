import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'CUSTOMER' | 'TECHNICIAN';
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
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
    await prisma.technicianProfile.create({
      data: { userId: user.id },
    });
  }

  const token = signToken({ id: user.id, role: user.role });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status === 'BANNED') {
    throw new AppError('Your account has been banned', 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ id: user.id, role: user.role });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { technicianProfile: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};