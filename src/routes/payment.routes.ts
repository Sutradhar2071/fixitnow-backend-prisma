import { Router } from 'express';
import {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
} from '../controllers/payment.controller';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createPaymentSchema } from '../validations/payment.validation';

const router = Router();

router.post('/create', protect, validate(createPaymentSchema), createPayment);
router.get('/confirm', confirmPayment); // called via success_url redirect (session_id in query)
router.post('/confirm', protect, confirmPayment); // manual confirm option
router.get('/', protect, getMyPayments);
router.get('/:id', protect, getPaymentById);

export default router;