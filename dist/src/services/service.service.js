"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyServices = exports.deleteService = exports.updateService = exports.createService = exports.getAllServices = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllServices = async (filters) => {
    const where = {};
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice)
            where.price.gte = Number(filters.minPrice);
        if (filters.maxPrice)
            where.price.lte = Number(filters.maxPrice);
    }
    if (filters.location) {
        where.technician = {
            location: { contains: filters.location, mode: 'insensitive' },
        };
    }
    return prisma_1.default.service.findMany({
        where,
        include: {
            category: true,
            technician: {
                include: { user: { select: { name: true } } },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getAllServices = getAllServices;
const AppError_1 = require("../utils/AppError");
const createService = async (userId, data) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new AppError_1.AppError('Technician profile not found', 404);
    }
    const category = await prisma_1.default.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
        throw new AppError_1.AppError('Category not found', 404);
    }
    return prisma_1.default.service.create({
        data: {
            ...data,
            technicianId: profile.id,
        },
    });
};
exports.createService = createService;
const updateService = async (userId, serviceId, data) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile)
        throw new AppError_1.AppError('Technician profile not found', 404);
    const service = await prisma_1.default.service.findUnique({ where: { id: serviceId } });
    if (!service)
        throw new AppError_1.AppError('Service not found', 404);
    if (service.technicianId !== profile.id) {
        throw new AppError_1.AppError('You do not own this service', 403);
    }
    return prisma_1.default.service.update({ where: { id: serviceId }, data });
};
exports.updateService = updateService;
const deleteService = async (userId, serviceId) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile)
        throw new AppError_1.AppError('Technician profile not found', 404);
    const service = await prisma_1.default.service.findUnique({ where: { id: serviceId } });
    if (!service)
        throw new AppError_1.AppError('Service not found', 404);
    if (service.technicianId !== profile.id) {
        throw new AppError_1.AppError('You do not own this service', 403);
    }
    await prisma_1.default.service.delete({ where: { id: serviceId } });
    return null;
};
exports.deleteService = deleteService;
const getMyServices = async (userId) => {
    const profile = await prisma_1.default.technicianProfile.findUnique({ where: { userId } });
    if (!profile)
        throw new AppError_1.AppError('Technician profile not found', 404);
    return prisma_1.default.service.findMany({
        where: { technicianId: profile.id },
        include: { category: true },
    });
};
exports.getMyServices = getMyServices;
