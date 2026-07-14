"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyServices = exports.deleteService = exports.updateService = exports.createService = exports.getServices = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const serviceService = __importStar(require("../services/service.service"));
exports.getServices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { categoryId, location, minPrice, maxPrice } = req.query;
    const services = await serviceService.getAllServices({
        categoryId: typeof categoryId === 'string' ? categoryId : undefined,
        location: typeof location === 'string' ? location : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, 200, 'Services fetched successfully', services);
});
exports.createService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const service = await serviceService.createService(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, 201, 'Service created successfully', service);
});
exports.updateService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const service = await serviceService.updateService(req.user.id, id, req.body);
    (0, sendResponse_1.sendResponse)(res, 200, 'Service updated successfully', service);
});
exports.deleteService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await serviceService.deleteService(req.user.id, id);
    (0, sendResponse_1.sendResponse)(res, 200, 'Service deleted successfully', null);
});
exports.getMyServices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const services = await serviceService.getMyServices(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, 'My services fetched successfully', services);
});
