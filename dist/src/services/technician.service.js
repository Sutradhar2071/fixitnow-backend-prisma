"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAvailability = exports.updateTechnicianProfile = exports.getTechnicianById = exports.getAllTechnicians = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const getAllTechnicians = async (filters) => {
    const where = {};
    if (filters.location) {
        where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters.minRating) {
        where.avgRating = { gte: Number(filters.minRating) };
    }
    if (filters.skill) {
        where.skills = { has: filters.skill };
    }
    return prisma_1.default.technicianProfile.findMany({
        where,
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            services: true,
        },
    });
};
exports.getAllTechnicians = getAllTechnicians;
const getTechnicianById = async (id) => {
    const technician = await prisma_1.default.technicianProfile.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            services: { include: { category: true } },
            availability: true,
            reviews: {
                include: { customer: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
            },
        },
    });
    if (!technician) {
        throw new AppError_1.AppError('Technician not found', 404);
    }
    return technician;
};
exports.getTechnicianById = getTechnicianById;
const updateTechnicianProfile = async (userId, data) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new AppError_1.AppError('Technician profile not found', 404);
    }
    return prisma_1.default.technicianProfile.update({
        where: { userId },
        data,
    });
};
exports.updateTechnicianProfile = updateTechnicianProfile;
const setAvailability = async (userId, slots) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new AppError_1.AppError('Technician profile not found', 404);
    }
    // Replace all existing slots with new ones
    await prisma_1.default.availability.deleteMany({ where: { technicianId: profile.id } });
    const created = await prisma_1.default.availability.createMany({
        data: slots.map((slot) => ({ ...slot, technicianId: profile.id })),
    });
    return prisma_1.default.availability.findMany({ where: { technicianId: profile.id } });
};
exports.setAvailability = setAvailability;
