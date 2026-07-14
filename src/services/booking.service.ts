import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

export const createBooking = async (
  customerId: string,
  data: { serviceId: string; scheduledAt: string; notes?: string }
) => {
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) {
    throw new AppError('Service not found', 404);
  }

  return prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId: service.id,
      scheduledAt: new Date(data.scheduledAt),
      notes: data.notes,
    },
    include: { service: true },
  });
};

export const getMyBookingsAsCustomer = async (customerId: string) => {
  return prisma.booking.findMany({
    where: { customerId },
    include: {
      service: { include: { category: true } },
      technician: { include: { user: { select: { name: true, phone: true } } } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getMyBookingsAsTechnician = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Technician profile not found', 404);

  return prisma.booking.findMany({
    where: { technicianId: profile.id },
    include: {
      service: true,
      customer: { select: { name: true, phone: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getBookingById = async (bookingId: string, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: { include: { category: true } },
      customer: { select: { id: true, name: true, phone: true, email: true } },
      technician: { include: { user: { select: { id: true, name: true, phone: true } } } },
      payment: true,
      review: true,
    },
  });

  if (!booking) throw new AppError('Booking not found', 404);

  // Access control: only involved parties or admin can view
  if (role !== 'ADMIN') {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
    const isCustomer = booking.customerId === userId;
    const isTechnician = profile && booking.technicianId === profile.id;
    if (!isCustomer && !isTechnician) {
      throw new AppError('You do not have access to this booking', 403);
    }
  }

  return booking;
};

export const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  newStatus: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED'
) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError('Technician profile not found', 404);

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.technicianId !== profile.id) {
    throw new AppError('You do not own this booking', 403);
  }

  // Valid transitions
  const validTransitions: Record<string, string[]> = {
    REQUESTED: ['ACCEPTED', 'DECLINED'],
    PAID: ['IN_PROGRESS'],
    IN_PROGRESS: ['COMPLETED'],
  };

  const allowed = validTransitions[booking.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      `Cannot change status from ${booking.status} to ${newStatus}`,
      400
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });
};

export const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.customerId !== customerId) {
    throw new AppError('You do not own this booking', 403);
  }

  if (['IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(booking.status)) {
    throw new AppError(`Cannot cancel a booking that is ${booking.status}`, 400);
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  });
};