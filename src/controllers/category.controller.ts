import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import * as categoryService from '../services/category.service';

export const getCategories = catchAsync(async (req, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, 200, 'Categories fetched successfully', categories);
});