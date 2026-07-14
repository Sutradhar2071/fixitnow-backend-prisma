import { Request, Response } from 'express';
import stripe from '../config/stripe';
import prisma from '../config/prisma';

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    const payment = await prisma.payment.findUnique({
      where: { transactionId: session.id },
    });

    if (payment && payment.status !== 'COMPLETED') {
      await prisma.payment.update({
        where: { transactionId: session.id },
        data: { status: 'COMPLETED', paidAt: new Date() },
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'PAID' },
      });
    }
  }

  res.json({ received: true });
};