import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=EduConnect+Course",
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
