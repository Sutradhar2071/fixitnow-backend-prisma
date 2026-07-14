"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    // ---------- Admin User ----------
    const adminPassword = await bcryptjs_1.default.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@fixitnow.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@fixitnow.com",
            password: adminPassword,
            role: client_1.Role.ADMIN,
            phone: "01700000000",
        },
    });
    console.log("✅ Admin created:", admin.email);
    // ---------- Categories ----------
    const categoryNames = [
        "Plumbing",
        "Electrical",
        "Cleaning",
        "Painting",
        "Carpentry",
    ];
    for (const name of categoryNames) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log("✅ Categories created:", categoryNames.join(", "));
    // ---------- Sample Customer ----------
    const customerPassword = await bcryptjs_1.default.hash("customer123", 10);
    await prisma.user.upsert({
        where: { email: "customer@fixitnow.com" },
        update: {},
        create: {
            name: "Test Customer",
            email: "customer@fixitnow.com",
            password: customerPassword,
            role: client_1.Role.CUSTOMER,
            phone: "01711111111",
        },
    });
    console.log("✅ Sample customer created");
    // ---------- Sample Technician ----------
    const techPassword = await bcryptjs_1.default.hash("tech123", 10);
    const techUser = await prisma.user.upsert({
        where: { email: "technician@fixitnow.com" },
        update: {},
        create: {
            name: "Test Technician",
            email: "technician@fixitnow.com",
            password: techPassword,
            role: client_1.Role.TECHNICIAN,
            phone: "01722222222",
        },
    });
    await prisma.technicianProfile.upsert({
        where: { userId: techUser.id },
        update: {},
        create: {
            userId: techUser.id,
            bio: "Experienced plumber with 5+ years",
            skills: ["Plumbing", "Pipe Fitting"],
            experience: 5,
            location: "Dhaka",
        },
    });
    console.log("✅ Sample technician created");
}
main()
    .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
