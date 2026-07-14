import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import * as serviceService from '../services/service.service';
import { AuthRequest } from '../middlewares/auth';

export const getServices = catchAsync(async (req, res: Response) => {
  const { categoryId, location, minPrice, maxPrice } = req.query;

  const services = await serviceService.getAllServices({
    categoryId: typeof categoryId === 'string' ? categoryId : undefined,
    location: typeof location === 'string' ? location : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  sendResponse(res, 200, 'Services fetched successfully', services);
});

export const createService = catchAsync(async (req: AuthRequest, res: Response) => {
  const service = await serviceService.createService(req.user!.id, req.body);
  sendResponse(res, 201, 'Service created successfully', service);
});

export const updateService = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const service = await serviceService.updateService(req.user!.id, id as string, req.body);
  sendResponse(res, 200, 'Service updated successfully', service);
});

export const deleteService = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await serviceService.deleteService(req.user!.id, id as string);
  sendResponse(res, 200, 'Service deleted successfully', null);
});

export const getMyServices = catchAsync(async (req: AuthRequest, res: Response) => {
  const services = await serviceService.getMyServices(req.user!.id);
  sendResponse(res, 200, 'My services fetched successfully', services);
});