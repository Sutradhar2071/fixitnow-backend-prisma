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
exports.getPaymentById = exports.getMyPayments = exports.confirmPayment = exports.createPayment = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const paymentService = __importStar(require("../services/payment.service"));
exports.createPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { bookingId } = req.body;
    const result = await paymentService.createPaymentSession(bookingId, req.user.id);
    (0, sendResponse_1.sendResponse)(res, 201, "Payment session created", result);
});
exports.confirmPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const rawSessionId = req.query.session_id || req.body.sessionId;
    if (!rawSessionId) {
        return (0, sendResponse_1.sendResponse)(res, 400, "Session ID is required", null);
    }
    const sessionId = Array.isArray(rawSessionId)
        ? String(rawSessionId[0])
        : String(rawSessionId);
    const result = await paymentService.confirmPaymentFromSession(sessionId);
    (0, sendResponse_1.sendResponse)(res, 200, "Payment status checked", result);
});
exports.getMyPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payments = await paymentService.getMyPayments(req.user.id);
    (0, sendResponse_1.sendResponse)(res, 200, "Payment history fetched", payments);
});
exports.getPaymentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(id, req.user.id, req.user.role);
    (0, sendResponse_1.sendResponse)(res, 200, "Payment fetched", payment);
});
