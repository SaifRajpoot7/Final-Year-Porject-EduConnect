import mongoose from "mongoose";

const lectureAttendanceSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  firstJoinedAt: Date,
  lastJoinedAt: Date,
  totalJoinedMs: {
    type: Number,
    default: 0,
  },

  present: {
    type: Boolean,
    default: false,
  },

  active: {
    type: Boolean,
    default: false, // prevents multi-tab join
  },
}, { timestamps: true });

lectureAttendanceSchema.index({ lecture: 1, user: 1 }, { unique: true });

export default mongoose.model("LectureAttendance", lectureAttendanceSchema);
