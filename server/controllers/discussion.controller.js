import Discussion from "../models/discussion.model.js";
import { io } from "../server.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Send a message (Text or File)
const sendMessage = async (req, res) => {
    try {
        const { content, courseId } = req.body;
        const userId = req.user._id;
        
        // 1. Security Check: Ensure user is a member of the course
        // (Assuming courseRole middleware sets req.isCourseMember)
        if (!req.isCourseMember) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not a member of this course" 
            });
        }

        // 2. Handle Attachment (if any)
        let attachmentUrl = null;
        let attachmentType = null;

        if (req.file?.path) {
            const uploaded = await uploadOnCloudinary(req.file.path);
            attachmentUrl = uploaded.secure_url;
            
            // Simple check to determine type based on mimetype
            attachmentType = req.file.mimetype.startsWith("image/") ? "image" : "file";
        }

        if (!content && !attachmentUrl) {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }

        // 3. Create Message in Database
        let message = await Discussion.create({
            course: courseId,
            sender: userId,
            content,
            attachment: attachmentUrl,
            attachmentType
        });

        // 4. Populate Sender Info (Need name & avatar for UI)
        message = await message.populate("sender", "fullName profilePicture email");

        // 5. 🔥 SOCKET EMIT: Broadcast to everyone in the course room
        io.to(courseId).emit("newDiscussionMessage", message);

        return res.status(201).json({ success: true, message });

    } catch (err) {
        console.error("Send Message Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get All Messages for a Course
const getCourseMessages = async (req, res) => {
    try {
        const { courseId } = req.query;

        if (!req.isCourseMember) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not a member of this course" 
            });
        }

        const messages = await Discussion.find({ course: courseId })
            .populate("sender", "fullName profilePicture email")
            .sort({ createdAt: 1 }); // Oldest first (Chat style)

        return res.status(200).json({ success: true, messages });

    } catch (err) {
        console.error("Get Messages Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export default { sendMessage, getCourseMessages };