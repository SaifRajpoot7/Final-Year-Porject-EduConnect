// models/appeal.model.js
import mongoose from "mongoose";

const appealSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true }, // "I didn't spam, my account was hacked!"
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

const Appeal = mongoose.model("Appeal", appealSchema);
export default Appeal;