import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import * as paymentService from "../services/payment.service";
import { AuthRequest } from "../middlewares/auth";

export const createPayment = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.body;
    const result = await paymentService.createPaymentSession(
      bookingId,
      req.user!.id,
    );
    sendResponse(res, 201, "Payment session created", result);
  },
);

export const confirmPayment = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const rawSessionId = req.query.session_id || req.body.sessionId;

    if (!rawSessionId) {
      return sendResponse(res, 400, "Session ID is required", null);
    }

    const sessionId = Array.isArray(rawSessionId)
      ? String(rawSessionId[0])
      : String(rawSessionId);

    const result = await paymentService.confirmPaymentFromSession(sessionId);
    sendResponse(res, 200, "Payment status checked", result);
  },
);

export const getMyPayments = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const payments = await paymentService.getMyPayments(req.user!.id);
    sendResponse(res, 200, "Payment history fetched", payments);
  },
);

export const getPaymentById = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(
      id as string,
      req.user!.id,
      req.user!.role,
    );
    sendResponse(res, 200, "Payment fetched", payment);
  },
);
