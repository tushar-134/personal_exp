import dotenv from "dotenv";
import User from "../models/User.js";
import { connectDb } from "../config/connectDb.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDb();

  const adminPayload = {
    name: process.env.ADMIN_NAME || "System Admin",
    email: (process.env.ADMIN_EMAIL || "admin@example.com").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    role: "admin",
  };

  const existing = await User.findOne({ email: adminPayload.email });

  if (existing) {
    existing.name = adminPayload.name;
    existing.role = "admin";
    existing.password = adminPayload.password;
    await existing.save();
    console.log("Admin user updated.");
  } else {
    await User.create(adminPayload);
    console.log("Admin user created.");
  }

  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
