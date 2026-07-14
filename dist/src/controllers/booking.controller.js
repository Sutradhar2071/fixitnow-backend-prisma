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
exports.updateBookingStatus = exports.getTechnicianBookings = exports.cancelBooking = exports.getBookingById = exports.getMyBookings = exports.createBooking = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const bookingService = __importStar(require("../services/booking.service"));
// ---- Customer side ----
exports.createBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, 201, 'Booking created successfully', booking);
});
exports.getMyBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const bookings = await bookingService.getMyBookingsAsCustomer(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, 'Bookings fetched successfully', bookings);
});
exports.getBookingById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id, req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, 200, 'Booking fetched successfully', booking);
});
exports.cancelBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const booking = await bookingService.cancelBooking(id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, 'Booking cancelled successfully', booking);
});
// ---- Technician side ----
exports.getTechnicianBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const bookings = await bookingService.getMyBookingsAsTechnician(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, 'Bookings fetched successfully', bookings);
});
exports.updateBookingStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(id, req.user.id, status);
    (0, sendResponse_1.sendResponse)(res, 200, 'Booking status updated successfully', booking);
});
