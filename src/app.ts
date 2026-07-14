import express, { Application, Request, Response } from 'express';
import cors from 'cors';

// Middleware Imports
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';

// Controller Imports (Webhook)
import { stripeWebhook } from './controllers/webhook.controller';

// Route Imports
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import technicianRoutes from './routes/technician.routes';
import serviceRoutes from './routes/service.routes';
import bookingRoutes from './routes/booking.routes';
import technicianBookingRoutes from './routes/technician-booking.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import adminRoutes from './routes/admin.routes';

const app: Application = express();

// Global Middlewares
app.use(cors());

// ⚠️ Webhook route MUST come before express.json(), as Stripe needs raw body to verify signature
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Body Parser Middleware
app.use(express.json());

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'FixItNow API is running 🔧',
  });
});

// Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/technician/bookings', technicianBookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler (must be after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be at the very end)
app.use(globalErrorHandler);

export default app;