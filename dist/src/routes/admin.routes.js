"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const admin_validation_1 = require("../validations/admin.validation");
const router = (0, express_1.Router)();
router.use(auth_1.protect, (0, auth_1.restrictTo)('ADMIN')); // সব admin route এ auth+role check
router.get('/users', admin_controller_1.getAllUsers);
router.patch('/users/:id', (0, validate_1.validate)(admin_validation_1.updateUserStatusSchema), admin_controller_1.updateUserStatus);
router.get('/bookings', admin_controller_1.getAllBookings);
router.get('/categories', admin_controller_1.getAllCategories);
router.post('/categories', (0, validate_1.validate)(admin_validation_1.createCategorySchema), admin_controller_1.createCategory);
exports.default = router;
