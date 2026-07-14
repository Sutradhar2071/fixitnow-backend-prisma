import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

interface TechnicianFilters {
  location?: string;
  minRating?: number;
  skill?: string;
}

export const getAllTechnicians = async (filters: TechnicianFilters) => {
  const where: any = {};

  if (filters.location) {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }
  if (filters.minRating) {
    where.avgRating = { gte: Number(filters.minRating) };
  }
  if (filters.skill) {
    where.skills = { has: filters.skill };
  }

  return prisma.technicianProfile.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      services: true,
    },
  });
};

export const getTechnicianById = async (id: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      services: { include: { category: true } },
      availability: true,
      reviews: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!technician) {
    throw new AppError('Technician not found', 404);
  }

  return technician;
};


export const updateTechnicianProfile = async (
  userId: string,
  data: { bio?: string; skills?: string[]; experience?: number; location?: string }
) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError('Technician profile not found', 404);
  }

  return prisma.technicianProfile.update({
    where: { userId },
    data,
  });
};

export const setAvailability = async (
  userId: string,
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError('Technician profile not found', 404);
  }

  // Replace all existing slots with new ones
  await prisma.availability.deleteMany({ where: { technicianId: profile.id } });

  const created = await prisma.availability.createMany({
    data: slots.map((slot) => ({ ...slot, technicianId: profile.id })),
  });

  return prisma.availability.findMany({ where: { technicianId: profile.id } });
};