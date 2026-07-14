import prisma from '../config/prisma';

interface ServiceFilters {
  categoryId?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const getAllServices = async (filters: ServiceFilters) => {
  const where: any = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = Number(filters.minPrice);
    if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
  }
  if (filters.location) {
    where.technician = {
      location: { contains: filters.location, mode: 'insensitive' },
    };
  }

  return prisma.service.findMany({
    where,
    include: {
      category: true,
      technician: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};



import { AppError } from '../utils/AppError';

export const createService = async (
  userId: string,
  data: { title: string; description?: string; price: number; categoryId: string }
) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError('Technician profile not found', 404);
  }

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return prisma.service.create({
    data: {
      ...data,
      technicianId: profile.id,
    },
  });
};

export const updateService = async (
  userId: string,
  serviceId: string,
  data: Partial<{ title: string; description: string; price: number; categoryId: string }>
) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Technician profile not found', 404);

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new AppError('Service not found', 404);
  if (service.technicianId !== profile.id) {
    throw new AppError('You do not own this service', 403);
  }

  return prisma.service.update({ where: { id: serviceId }, data });
};

export const deleteService = async (userId: string, serviceId: string) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Technician profile not found', 404);

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new AppError('Service not found', 404);
  if (service.technicianId !== profile.id) {
    throw new AppError('You do not own this service', 403);
  }

  await prisma.service.delete({ where: { id: serviceId } });
  return null;
};

export const getMyServices = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Technician profile not found', 404);

  return prisma.service.findMany({
    where: { technicianId: profile.id },
    include: { category: true },
  });
};