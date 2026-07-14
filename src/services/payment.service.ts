import prisma from '../config/prisma';
import stripe from '../config/stripe';
import { AppError } from '../utils/AppError';

export const createPaymentSession = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });

  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.customerId !== userId) {
    throw new AppError('You do not own this booking', 403);
  }
  if (booking.status !== 'ACCEPTED') {
    throw new AppError('Booking must be ACCEPTED before payment', 400);
  }

  // Prevent duplicate payment records
  const existingPayment = await prisma.payment.findUnique({ where: { bookingId } });
  if (existingPayment && existingPayment.status === 'COMPLETED') {
    throw new AppError('This booking is already paid', 400);
  }

  const session = await stripe.checkout.sessions.create({
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
  const payment = await prisma.payment.upsert({
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

export const confirmPaymentFromSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const payment = await prisma.payment.findUnique({ where: { transactionId: sessionId } });
  if (!payment) throw new AppError('Payment record not found', 404);

  if (session.payment_status === 'paid') {
    await prisma.payment.update({
      where: { transactionId: sessionId },
      data: { status: 'COMPLETED', paidAt: new Date() },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'PAID' },
    });

    return { status: 'COMPLETED' };
  } else {
    await prisma.payment.update({
      where: { transactionId: sessionId },
      data: { status: 'FAILED' },
    });
    return { status: 'FAILED' };
  }
};

export const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: { booking: { include: { service: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPaymentById = async (paymentId: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { booking: { include: { service: true } } },
  });

  if (!payment) throw new AppError('Payment not found', 404);
  if (role !== 'ADMIN' && payment.userId !== userId) {
    throw new AppError('You do not have access to this payment', 403);
  }

  return payment;
};