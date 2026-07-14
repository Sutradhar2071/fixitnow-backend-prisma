import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import * as technicianService from "../services/technician.service";
import { AuthRequest } from '../middlewares/auth';

export const getTechnicians = catchAsync(
  async (req: Request, res: Response) => {
    const { location, minRating, skill } = req.query;

    const technicians = await technicianService.getAllTechnicians({
      location: typeof location === "string" ? location : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      skill: typeof skill === "string" ? skill : undefined,
    });

    sendResponse(res, 200, "Technicians fetched successfully", technicians);
  },
);

export const getTechnicianById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const technician = await technicianService.getTechnicianById(id as string);

    sendResponse(res, 200, "Technician fetched successfully", technician);
  },
);

export const updateMyProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const profile = await technicianService.updateTechnicianProfile(
      req.user!.id,
      req.body,
    );
    sendResponse(res, 200, "Profile updated successfully", profile);
  },
);

export const updateMyAvailability = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const availability = await technicianService.setAvailability(
      req.user!.id,
      req.body.slots,
    );
    sendResponse(res, 200, "Availability updated successfully", availability);
  },
);
