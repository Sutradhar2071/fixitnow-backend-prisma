"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const technician_controller_1 = require("../controllers/technician.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const technician_validation_1 = require("../validations/technician.validation");
const router = (0, express_1.Router)();
// Public
router.get('/', technician_controller_1.getTechnicians);
router.get('/:id', technician_controller_1.getTechnicianById);
// Technician-only
router.put('/profile', auth_1.protect, (0, auth_1.restrictTo)('TECHNICIAN'), (0, validate_1.validate)(technician_validation_1.updateProfileSchema), technician_controller_1.updateMyProfile);
router.put('/availability', auth_1.protect, (0, auth_1.restrictTo)('TECHNICIAN'), (0, validate_1.validate)(technician_validation_1.setAvailabilitySchema), technician_controller_1.updateMyAvailability);
exports.default = router;
