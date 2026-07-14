import { Router } from 'express';
import {
  getTechnicians,
  getTechnicianById,
  updateMyProfile,
  updateMyAvailability,
} from '../controllers/technician.controller';
import { protect, restrictTo } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateProfileSchema, setAvailabilitySchema } from '../validations/technician.validation';

const router = Router();

// Public
router.get('/', getTechnicians);
router.get('/:id', getTechnicianById);

// Technician-only
router.put(
  '/profile',
  protect,
  restrictTo('TECHNICIAN'),
  validate(updateProfileSchema),
  updateMyProfile
);
router.put(
  '/availability',
  protect,
  restrictTo('TECHNICIAN'),
  validate(setAvailabilitySchema),
  updateMyAvailability
);

export default router;