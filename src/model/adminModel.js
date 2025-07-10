import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 6;
            },
            message: "Password must be at least 6 characters long"
        }
    },
    role: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

export default mongoose.model("admin", adminSchema)