import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";


const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });


const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ---------- Admin User ----------
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fixitnow.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@fixitnow.com",
      password: adminPassword,
      role: Role.ADMIN,
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
  const customerPassword = await bcrypt.hash("customer123", 10);
  await prisma.user.upsert({
    where: { email: "customer@fixitnow.com" },
    update: {},
    create: {
      name: "Test Customer",
      email: "customer@fixitnow.com",
      password: customerPassword,
      role: Role.CUSTOMER,
      phone: "01711111111",
    },
  });

  console.log("✅ Sample customer created");

  // ---------- Sample Technician ----------
  const techPassword = await bcrypt.hash("tech123", 10);
  const techUser = await prisma.user.upsert({
    where: { email: "technician@fixitnow.com" },
    update: {},
    create: {
      name: "Test Technician",
      email: "technician@fixitnow.com",
      password: techPassword,
      role: Role.TECHNICIAN,
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
