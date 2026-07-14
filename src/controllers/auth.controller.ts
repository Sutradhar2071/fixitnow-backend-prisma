import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth';

export const register = catchAsync(async (req, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, 201, 'User registered successfully', result);
});

export const login = catchAsync(async (req, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  sendResponse(res, 200, 'Login successful', result);
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  sendResponse(res, 200, 'Current user fetched', user);
});