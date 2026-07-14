"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsForTechnician = exports.createReview = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const createReview = async (customerId, data) => {
    const booking = await prisma_1.default.booking.findUnique({
        where: { id: data.bookingId },
        include: { review: true },
    });
    if (!booking)
        throw new AppError_1.AppError('Booking not found', 404);
    if (booking.customerId !== customerId) {
        throw new AppError_1.AppError('You do not own this booking', 403);
    }
    if (booking.status !== 'COMPLETED') {
        throw new AppError_1.AppError('You can only review a completed booking', 400);
    }
    if (booking.review) {
        throw new AppError_1.AppError('You have already reviewed this booking', 400);
    }
    const review = await prisma_1.default.review.create({
        data: {
            bookingId: booking.id,
            customerId,
            technicianId: booking.technicianId,
            rating: data.rating,
            comment: data.comment,
        },
    });
    // Recalculate technician's average rating
    const aggregate = await prisma_1.default.review.aggregate({
        where: { technicianId: booking.technicianId },
        _avg: { rating: true },
    });
    await prisma_1.default.technicianProfile.update({
        where: { id: booking.technicianId },
        data: { avgRating: aggregate._avg.rating || 0 },
    });
    return review;
};
exports.createReview = createReview;
const getReviewsForTechnician = async (technicianId) => {
    return prisma_1.default.review.findMany({
        where: { technicianId },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getReviewsForTechnician = getReviewsForTechnician;
