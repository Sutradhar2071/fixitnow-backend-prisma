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
exports.createCategory = exports.getAllCategories = exports.getAllBookings = exports.updateUserStatus = exports.getAllUsers = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const adminService = __importStar(require("../services/admin.service"));
const categoryService = __importStar(require("../services/category.service"));
exports.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await adminService.getAllUsers(req.query.role);
    (0, sendResponse_1.sendResponse)(res, 200, 'Users fetched successfully', users);
});
exports.updateUserStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // id as string type casting
    const user = await adminService.updateUserStatus(req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, 200, 'User status updated successfully', user);
});
exports.getAllBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const bookings = await adminService.getAllBookings(req.query.status);
    (0, sendResponse_1.sendResponse)(res, 200, 'Bookings fetched successfully', bookings);
});
exports.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    (0, sendResponse_1.sendResponse)(res, 200, 'Categories fetched successfully', categories);
});
exports.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await categoryService.createCategory(req.body.name);
    (0, sendResponse_1.sendResponse)(res, 201, 'Category created successfully', category);
});
