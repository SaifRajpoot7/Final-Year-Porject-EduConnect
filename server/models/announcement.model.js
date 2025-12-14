import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            trim: true
        },
        content: {
            type: String,
        },
        attachmentType: {
            type: String,
            enum: ["image", "file"],
        },
        attachment: {
            type: String // URL
        },
        createdAt:{
            type: Date,
            required: true,
        }
    },
    { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;