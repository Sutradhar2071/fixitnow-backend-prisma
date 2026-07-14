"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.updateBookingStatus = exports.getBookingById = exports.getMyBookingsAsTechnician = exports.getMyBookingsAsCustomer = exports.createBooking = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const createBooking = async (customerId, data) => {
    const service = await prisma_1.default.service.findUnique({ where: { id: data.serviceId } });
    if (!service) {
        throw new AppError_1.AppError('Service not found', 404);
    }
    return prisma_1.default.booking.create({
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
exports.createBooking = createBooking;
const getMyBookingsAsCustomer = async (customerId) => {
    return prisma_1.default.booking.findMany({
        where: { customerId },
        include: {
            service: { include: { category: true } },
            technician: { include: { user: { select: { name: true, phone: true } } } },
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getMyBookingsAsCustomer = getMyBookingsAsCustomer;
const getMyBookingsAsTechnician = async (userId) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile)
        throw new AppError_1.AppError('Technician profile not found', 404);
    return prisma_1.default.booking.findMany({
        where: { technicianId: profile.id },
        include: {
            service: true,
            customer: { select: { name: true, phone: true, email: true } },
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getMyBookingsAsTechnician = getMyBookingsAsTechnician;
const getBookingById = async (bookingId, userId, role) => {
    const booking = await prisma_1.default.booking.findUnique({
        where: { id: bookingId },
        include: {
            service: { include: { category: true } },
            customer: { select: { id: true, name: true, phone: true, email: true } },
            technician: { include: { user: { select: { id: true, name: true, phone: true } } } },
            payment: true,
            review: true,
        },
    });
    if (!booking)
        throw new AppError_1.AppError('Booking not found', 404);
    // Access control: only involved parties or admin can view
    if (role !== 'ADMIN') {
        const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
        const isCustomer = booking.customerId === userId;
        const isTechnician = profile && booking.technicianId === profile.id;
        if (!isCustomer && !isTechnician) {
            throw new AppError_1.AppError('You do not have access to this booking', 403);
        }
    }
    return booking;
};
exports.getBookingById = getBookingById;
const updateBookingStatus = async (bookingId, userId, newStatus) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile)
        throw new AppError_1.AppError('Technician profile not found', 404);
    const booking = await prisma_1.default.booking.findUnique({ where: { id: bookingId } });
    if (!booking)
        throw new AppError_1.AppError('Booking not found', 404);
    if (booking.technicianId !== profile.id) {
        throw new AppError_1.AppError('You do not own this booking', 403);
    }
    // Valid transitions
    const validTransitions = {
        REQUESTED: ['ACCEPTED', 'DECLINED'],
        PAID: ['IN_PROGRESS'],
        IN_PROGRESS: ['COMPLETED'],
    };
    const allowed = validTransitions[booking.status] || [];
    if (!allowed.includes(newStatus)) {
        throw new AppError_1.AppError(`Cannot change status from ${booking.status} to ${newStatus}`, 400);
    }
    return prisma_1.default.booking.update({
        where: { id: bookingId },
        data: { status: newStatus },
    });
};
exports.updateBookingStatus = updateBookingStatus;
const cancelBooking = async (bookingId, customerId) => {
    const booking = await prisma_1.default.booking.findUnique({ where: { id: bookingId } });
    if (!booking)
        throw new AppError_1.AppError('Booking not found', 404);
    if (booking.customerId !== customerId) {
        throw new AppError_1.AppError('You do not own this booking', 403);
    }
    if (['IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(booking.status)) {
        throw new AppError_1.AppError(`Cannot cancel a booking that is ${booking.status}`, 400);
    }
    return prisma_1.default.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
    });
};
exports.cancelBooking = cancelBooking;
