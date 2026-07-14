import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

export const createReview = async (
  customerId: string,
  data: { bookingId: string; rating: number; comment?: string }
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: { review: true },
  });

  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.customerId !== customerId) {
    throw new AppError('You do not own this booking', 403);
  }
  if (booking.status !== 'COMPLETED') {
    throw new AppError('You can only review a completed booking', 400);
  }
  if (booking.review) {
    throw new AppError('You have already reviewed this booking', 400);
  }

  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      customerId,
      technicianId: booking.technicianId,
      rating: data.rating,
      comment: data.comment,
    },
  });

  // Recalculate technician's average rating
  const aggregate = await prisma.review.aggregate({
    where: { technicianId: booking.technicianId },
    _avg: { rating: true },
  });

  await prisma.technicianProfile.update({
    where: { id: booking.technicianId },
    data: { avgRating: aggregate._avg.rating || 0 },
  });

  return review;
};

export const getReviewsForTechnician = async (technicianId: string) => {
  return prisma.review.findMany({
    where: { technicianId },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};