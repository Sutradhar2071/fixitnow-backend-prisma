"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const payment_validation_1 = require("../validations/payment.validation");
const router = (0, express_1.Router)();
router.post('/create', auth_1.protect, (0, validate_1.validate)(payment_validation_1.createPaymentSchema), payment_controller_1.createPayment);
router.get('/confirm', payment_controller_1.confirmPayment); // called via success_url redirect (session_id in query)
router.post('/confirm', auth_1.protect, payment_controller_1.confirmPayment); // manual confirm option
router.get('/', auth_1.protect, payment_controller_1.getMyPayments);
router.get('/:id', auth_1.protect, payment_controller_1.getPaymentById);
exports.default = router;
