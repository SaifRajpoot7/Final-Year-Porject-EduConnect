import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalJoinedMs: {
        type: Number,
        default: 0
    },
    lastJoinedAt: {
        type: Date,
        default: null
    },
    present: {
        type: Boolean,
        default: false
    },
    // Optional: for future features
    mediaAllowed: { type: Boolean, default: false }
}, { _id: false });

const lectureSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    scheduledStart: {
        type: Date,
        required: true,
        index: true
    },
    // Actual start time when teacher clicks "Start"
    startsAt: {
        type: Date,
        index: true
    },
    scheduledEnd: {
        type: Date,
        required: true,
        index: true
    },
    endedAt: {
        type: Date,
        index: true
    },
    status: {
        type: String,
        enum: ["upcoming", "live", "ended"],
        default: "upcoming",
        index: true
    },
    attendance: [attendanceSchema] 

}, { timestamps: true });

export default mongoose.model("Lecture", lectureSchema);