import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Links to the user who sent the message
            required: true
        },
        content: {
            type: String,
            trim: true
        },
        attachment: {
            type: String, // URL for images/files
            default: null
        },
        attachmentType: {
            type: String,
            enum: ["image", "file", null],
            default: null
        }
    },
    { timestamps: true }
);

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;