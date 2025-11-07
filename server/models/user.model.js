import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Exclude password from queries by default
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    verificationOtp: {
        type: String,
        default: ''
    },
    verificationOtpTimeOut: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String,
        default: ''
    },
    resetTokenTimeOut: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;