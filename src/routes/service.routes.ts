import { Router } from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getMyServices,
} from '../controllers/service.controller';
import { protect, restrictTo } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createServiceSchema, updateServiceSchema } from '../validations/technician.validation';

const router = Router();

// Public
router.get('/', getServices);

// Technician-only
router.get('/my/list', protect, restrictTo('TECHNICIAN'), getMyServices);
router.post('/', protect, restrictTo('TECHNICIAN'), validate(createServiceSchema), createService);
router.put('/:id', protect, restrictTo('TECHNICIAN'), validate(updateServiceSchema), updateService);
router.delete('/:id', protect, restrictTo('TECHNICIAN'), deleteService);

export default router;