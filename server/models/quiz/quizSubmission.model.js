import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedOptionIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    obtainedMarks: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "graded",
    },
  },
  { timestamps: true }
);

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);
export default QuizSubmission;
