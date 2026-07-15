# FixItNow 🔧 — Backend API

A backend API for a home services marketplace where customers book technicians for plumbing, electrical, cleaning, painting, and other home services. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🌐 Live API
https://fixitnow-api-8op9.onrender.com

## 📄 API Documentation
https://github.com/Sutradhar2071/fixitnow-backend-prisma/blob/main/FixItNow_API_postman_collection.json

## 🔑 Admin Credentials
Email: admin@fixitnow.com
Password: admin123

## 🛠️ Tech Stack
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Stripe Payments
- Zod Validation
- Deployed on Render

## 🚀 Getting Started (Local Setup)

1. Clone the repo
```bash
git clone https://github.com/<your-username>/fixitnow-backend.git
cd fixitnow-backend
```

2. Install dependencies
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your values
```bash
cp .env.example .env
```

4. Run migrations and seed the database
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the dev server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 👥 Roles
- **Customer**: Browse services, book technicians, pay, track bookings, leave reviews
- **Technician**: Manage profile & services, set availability, accept/decline/complete bookings
- **Admin**: Manage users (ban/unban), oversee bookings, manage categories

## 📊 Booking Status Flow
REQUESTED → ACCEPTED / DECLINED → PAID → IN_PROGRESS → COMPLETED
(CANCELLED possible before IN_PROGRESS)

## 💳 Payment
Stripe Checkout is used for payments. After a booking is ACCEPTED, the customer creates a payment session, completes payment via Stripe, and a webhook confirms it — updating the booking to PAID.

## ⚠️ Error Response Format
All errors follow this structure:
```json
{
  "success": false,
  "message": "Error description",
  "errorDetails": "..."
}
```

## 📁 Project Structure
src/
├── config/         # Prisma & Stripe clients
├── controllers/     # Route handlers
├── middlewares/      # Auth, validation, error handling
├── routes/           # Route definitions
├── services/         # Business logic
├── utils/             # Helpers (AppError, catchAsync, JWT)
├── validations/       # Zod schemas
├── app.ts
└── server.ts
prisma/
├── schema.prisma
└── seed.ts
