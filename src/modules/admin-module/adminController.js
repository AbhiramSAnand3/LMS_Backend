import Admin from "../../model/adminModel.js";
import { generateAuthToken } from "../../middlewares/generateAuthToken.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      saltRounds,
    );

    // Create new admin
    const defaultAdmin = new Admin({
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    // Save the admin to database
    await defaultAdmin.save();

    // Generate token (optional - if you want to use it right away)
    const token = generateAuthToken(defaultAdmin._id, defaultAdmin.role);

    console.log("Admin created successfully");
    return { admin: defaultAdmin, token };
  } catch (error) {
    console.error("Error creating default admin:", error.message);
    throw error;
  }
};

export default createDefaultAdmin;
