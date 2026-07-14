import { Router } from 'express';
import { createReview, getTechnicianReviews } from '../controllers/review.controller';
import { protect, restrictTo } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createReviewSchema } from '../validations/review.validation';

const router = Router();

router.post('/', protect, restrictTo('CUSTOMER'), validate(createReviewSchema), createReview);
router.get('/technician/:technicianId', getTechnicianReviews);

export default router;