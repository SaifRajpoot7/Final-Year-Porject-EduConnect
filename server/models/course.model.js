import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailType: {
      type: String,
    },
    courseImage: {
      type: String
    },
    placeholderTitle: {
      type: String
    },
    category: {
      type: String,
      default: "General",
    },
    content: {
      type: String, // Optional: course overview or syllabus
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Counters for quick stats
    lecturesCount: {
      type: Number,
      default: 0,
    },
    quizzesCount: {
      type: Number,
      default: 0,
    },
    assignmentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
