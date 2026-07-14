import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import * as adminService from '../services/admin.service';
import * as categoryService from '../services/category.service';

export const getAllUsers = catchAsync(async (req, res: Response) => {
  const users = await adminService.getAllUsers(req.query.role as string);
  sendResponse(res, 200, 'Users fetched successfully', users);
});

export const updateUserStatus = catchAsync(async (req, res: Response) => {
  // id as string type casting
  const user = await adminService.updateUserStatus(req.params.id as string, req.body.status);
  sendResponse(res, 200, 'User status updated successfully', user);
});

export const getAllBookings = catchAsync(async (req, res: Response) => {
  const bookings = await adminService.getAllBookings(req.query.status as string);
  sendResponse(res, 200, 'Bookings fetched successfully', bookings);
});

export const getAllCategories = catchAsync(async (req, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, 200, 'Categories fetched successfully', categories);
});

export const createCategory = catchAsync(async (req, res: Response) => {
  const category = await categoryService.createCategory(req.body.name);
  sendResponse(res, 201, 'Category created successfully', category);
});