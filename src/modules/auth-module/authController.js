import Admin from "../../model/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AdminLogin = async (req, res) => {  // Fixed parameter order and added async
    const {email, password} = req.body;

    try {
        const admin = await Admin.findOne({email});  // Added await
        if(!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);  // Added await
        if(!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({
            id: admin._id,
            role: admin.role
        }, process.env.JWT_SECRET, {expiresIn: "1d"});

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: `Bearer ${token}`,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
    }
};