"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getMyPayments = exports.confirmPaymentFromSession = exports.createPaymentSession = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const stripe_1 = __importDefault(require("../config/stripe"));
const AppError_1 = require("../utils/AppError");
const createPaymentSession = async (bookingId, userId) => {
    const booking = await prisma_1.default.booking.findUnique({
        where: { id: bookingId },
        include: { service: true },
    });
    if (!booking)
        throw new AppError_1.AppError('Booking not found', 404);
    if (booking.customerId !== userId) {
        throw new AppError_1.AppError('You do not own this booking', 403);
    }
    if (booking.status !== 'ACCEPTED') {
        throw new AppError_1.AppError('Booking must be ACCEPTED before payment', 400);
    }
    // Prevent duplicate payment records
    const existingPayment = await prisma_1.default.payment.findUnique({ where: { bookingId } });
    if (existingPayment && existingPayment.status === 'COMPLETED') {
        throw new AppError_1.AppError('This booking is already paid', 400);
    }
    const session = await stripe_1.default.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: { name: booking.service.title },
                    unit_amount: Math.round(booking.service.price * 100),
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_SUCCESS_URL || 'http://localhost:5000'}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_CANCEL_URL || 'http://localhost:5000'}/api/payments/cancel`,
        metadata: {
            bookingId: booking.id,
            userId,
        },
    });
    // Create/update a PENDING payment record
    const payment = await prisma_1.default.payment.upsert({
        where: { bookingId },
        update: {
            transactionId: session.id,
            amount: booking.service.price,
            status: 'PENDING',
        },
        create: {
            bookingId,
            userId,
            transactionId: session.id,
            amount: booking.service.price,
            provider: 'STRIPE',
            status: 'PENDING',
        },
    });
    return { checkoutUrl: session.url, payment };
};
exports.createPaymentSession = createPaymentSession;
const confirmPaymentFromSession = async (sessionId) => {
    const session = await stripe_1.default.checkout.sessions.retrieve(sessionId);
    const payment = await prisma_1.default.payment.findUnique({ where: { transactionId: sessionId } });
    if (!payment)
        throw new AppError_1.AppError('Payment record not found', 404);
    if (session.payment_status === 'paid') {
        await prisma_1.default.payment.update({
            where: { transactionId: sessionId },
            data: { status: 'COMPLETED', paidAt: new Date() },
        });
        await prisma_1.default.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'PAID' },
        });
        return { status: 'COMPLETED' };
    }
    else {
        await prisma_1.default.payment.update({
            where: { transactionId: sessionId },
            data: { status: 'FAILED' },
        });
        return { status: 'FAILED' };
    }
};
exports.confirmPaymentFromSession = confirmPaymentFromSession;
const getMyPayments = async (userId) => {
    return prisma_1.default.payment.findMany({
        where: { userId },
        include: { booking: { include: { service: true } } },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getMyPayments = getMyPayments;
const getPaymentById = async (paymentId, userId, role) => {
    const payment = await prisma_1.default.payment.findUnique({
        where: { id: paymentId },
        include: { booking: { include: { service: true } } },
    });
    if (!payment)
        throw new AppError_1.AppError('Payment not found', 404);
    if (role !== 'ADMIN' && payment.userId !== userId) {
        throw new AppError_1.AppError('You do not have access to this payment', 403);
    }
    return payment;
};
exports.getPaymentById = getPaymentById;
