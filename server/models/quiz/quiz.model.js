import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        questions: [
            {
                questionText: {
                    type: String,
                    required: true,
                    trim: true,
                },
                options: [
                    {
                        type: String,
                        required: true,
                    },
                ],
                correctOptionIndex: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalQuestions: {
            type: Number,
            default: 0,
        },
        maxMarks: {
            type: Number,
            default: 0,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        totalSubmissions: {
            type: Number,
        }
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
