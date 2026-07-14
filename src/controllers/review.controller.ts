import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import * as reviewService from '../services/review.service';
import { AuthRequest } from '../middlewares/auth';

export const createReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const review = await reviewService.createReview(req.user!.id, req.body);
  sendResponse(res, 201, 'Review submitted successfully', review);
});

export const getTechnicianReviews = catchAsync(async (req, res: Response) => {
  const { technicianId } = req.params;

  const reviews = await reviewService.getReviewsForTechnician(technicianId as string);

  sendResponse(res, 200, 'Reviews fetched successfully', reviews);
});