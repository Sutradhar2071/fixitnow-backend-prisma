import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/booking.controller';
import { protect, restrictTo } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createBookingSchema } from '../validations/booking.validation';

const router = Router();

router.post('/', protect, restrictTo('CUSTOMER'), validate(createBookingSchema), createBooking);
router.get('/', protect, restrictTo('CUSTOMER'), getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, restrictTo('CUSTOMER'), cancelBooking);

export default router;