import { Router } from 'express';
import {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
} from '../controllers/admin.controller';
import { protect, restrictTo } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateUserStatusSchema, createCategorySchema } from '../validations/admin.validation';

const router = Router();

router.use(protect, restrictTo('ADMIN')); // সব admin route এ auth+role check

router.get('/users', getAllUsers);
router.patch('/users/:id', validate(updateUserStatusSchema), updateUserStatus);
router.get('/bookings', getAllBookings);
router.get('/categories', getAllCategories);
router.post('/categories', validate(createCategorySchema), createCategory);

export default router;