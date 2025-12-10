import mongoose from "mongoose";

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submittedFile: {
      type: String, // URLs of submitted files
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    marksObtained: {
      type: Number,
    },
    feedback: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "late"],
      default: "submitted",
    },
    version: {
      type: Number,
      default: 1, // for multiple attempts
    },
  },
  { timestamps: true }
);

const AssignmentSubmission = mongoose.model("assignmentSubmission", assignmentSubmissionSchema);
export default AssignmentSubmission;
