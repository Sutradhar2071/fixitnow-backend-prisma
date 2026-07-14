"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Middleware Imports
const errorHandler_1 = require("./middlewares/errorHandler");
// Controller Imports (Webhook)
const webhook_controller_1 = require("./controllers/webhook.controller");
// Route Imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const technician_routes_1 = __importDefault(require("./routes/technician.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const technician_booking_routes_1 = __importDefault(require("./routes/technician-booking.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
// Global Middlewares
app.use((0, cors_1.default)());
// ⚠️ Webhook route MUST come before express.json(), as Stripe needs raw body to verify signature
app.post('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }), webhook_controller_1.stripeWebhook);
// Body Parser Middleware
app.use(express_1.default.json());
// Health Check Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'FixItNow API is running 🔧',
    });
});
// Application Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/technicians', technician_routes_1.default);
app.use('/api/services', service_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/technician/bookings', technician_booking_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// 404 Handler (must be after all routes)
app.use(errorHandler_1.notFoundHandler);
// Global Error Handler (must be at the very end)
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
