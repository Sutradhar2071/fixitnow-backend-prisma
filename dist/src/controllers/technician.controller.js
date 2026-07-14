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
exports.updateMyAvailability = exports.updateMyProfile = exports.getTechnicianById = exports.getTechnicians = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const technicianService = __importStar(require("../services/technician.service"));
exports.getTechnicians = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { location, minRating, skill } = req.query;
    const technicians = await technicianService.getAllTechnicians({
        location: typeof location === "string" ? location : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        skill: typeof skill === "string" ? skill : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, 200, "Technicians fetched successfully", technicians);
});
exports.getTechnicianById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const technician = await technicianService.getTechnicianById(id);
    (0, sendResponse_1.sendResponse)(res, 200, "Technician fetched successfully", technician);
});
exports.updateMyProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const profile = await technicianService.updateTechnicianProfile(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, 200, "Profile updated successfully", profile);
});
exports.updateMyAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const availability = await technicianService.setAvailability(req.user.id, req.body.slots);
    (0, sendResponse_1.sendResponse)(res, 200, "Availability updated successfully", availability);
});
