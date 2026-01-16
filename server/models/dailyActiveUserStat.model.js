import mongoose from "mongoose";

const dailyActiveUserStatSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true // One document per day (e.g., "2026-01-04")
    },
    loginIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    // For "User Growth" Chart (New Registrations)
    newUsers: { 
        type: Number, 
        default: 0 
    }
});

const DailyStat = mongoose.model("DailyStat", dailyActiveUserStatSchema);
export default DailyStat;