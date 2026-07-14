import { Router } from 'express';
import {
  getTechnicianBookings,
  updateBookingStatus,
} from '../controllers/booking.controller';
import { protect, restrictTo } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateBookingStatusSchema } from '../validations/booking.validation';

const router = Router();

router.get('/', protect, restrictTo('TECHNICIAN'), getTechnicianBookings);
router.patch(
  '/:id',
  protect,
  restrictTo('TECHNICIAN'),
  validate(updateBookingStatusSchema),
  updateBookingStatus
);

export default router;