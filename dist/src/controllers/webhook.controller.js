"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const stripe_1 = __importDefault(require("../config/stripe"));
const prisma_1 = __importDefault(require("../config/prisma"));
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const payment = await prisma_1.default.payment.findUnique({
            where: { transactionId: session.id },
        });
        if (payment && payment.status !== 'COMPLETED') {
            await prisma_1.default.payment.update({
                where: { transactionId: session.id },
                data: { status: 'COMPLETED', paidAt: new Date() },
            });
            await prisma_1.default.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'PAID' },
            });
        }
    }
    res.json({ received: true });
};
exports.stripeWebhook = stripeWebhook;
