import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import * as bookingService from '../services/booking.service';
import { AuthRequest } from '../middlewares/auth';

// ---- Customer side ----

export const createBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const booking = await bookingService.createBooking(req.user!.id, req.body);
  sendResponse(res, 201, 'Booking created successfully', booking);
});

export const getMyBookings = catchAsync(async (req: AuthRequest, res: Response) => {
  const bookings = await bookingService.getMyBookingsAsCustomer(req.user!.id);
  sendResponse(res, 200, 'Bookings fetched successfully', bookings);
});

export const getBookingById = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const booking = await bookingService.getBookingById(
    id as string,
    req.user!.id,
    req.user!.role
  );
  sendResponse(res, 200, 'Booking fetched successfully', booking);
});

export const cancelBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const booking = await bookingService.cancelBooking(id as string, req.user!.id);
  sendResponse(res, 200, 'Booking cancelled successfully', booking);
});

// ---- Technician side ----

export const getTechnicianBookings = catchAsync(async (req: AuthRequest, res: Response) => {
  const bookings = await bookingService.getMyBookingsAsTechnician(req.user!.id);
  sendResponse(res, 200, 'Bookings fetched successfully', bookings);
});

export const updateBookingStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await bookingService.updateBookingStatus(
    id as string,
    req.user!.id,
    status
  );
  sendResponse(res, 200, 'Booking status updated successfully', booking);
});