"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("../controllers/service.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const technician_validation_1 = require("../validations/technician.validation");
const router = (0, express_1.Router)();
// Public
router.get('/', service_controller_1.getServices);
// Technician-only
router.get('/my/list', auth_1.protect, (0, auth_1.restrictTo)('TECHNICIAN'), service_controller_1.getMyServices);
router.post('/', auth_1.protect, (0, auth_1.restrictTo)('TECHNICIAN'), (0, validate_1.validate)(technician_validation_1.createServiceSchema), service_controller_1.createService);
router.put('/:id', auth_1.protect, (0, auth_1.restrictTo)('TECHNICIAN'), (0, validate_1.validate)(technician_validation_1.updateServiceSchema), service_controller_1.updateService);
router.delete('/:id', auth_1.protect, (0, auth_1.restrictTo)('TECHNICIAN'), service_controller_1.deleteService);
exports.default = router;
