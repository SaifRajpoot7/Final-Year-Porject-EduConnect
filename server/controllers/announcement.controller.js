import Announcement from "../models/announcement.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { io } from "../server.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// const createAnnouncement = async (req, res) => {
//     try {
//         const { title, content, attachmentType } = req.body;

//         const teacher = req.user?._id;
//         const course = req.course?._id;
//         let attachmentUrl = null;

//         /* ===============================
//            1. Validate required fields
//         =============================== */

//         // if (!attachmentType) {
//         //     if (!content) {
//         //         return res.status(400).json({
//         //             success: false,
//         //             message: "Announcement content is required"
//         //         });
//         //     }
//         // }

//         if (!teacher) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized teacher"
//             });
//         }

//         if (!course) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Course is required"
//             });
//         }

//         /* ===============================
//            2. Check if course exists
//         =============================== */

//         const courseExists = await Course.findById(course);
//         if (!courseExists) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not found"
//             });
//         }

//         const studentEmails = courseExists.students; // ["a@gmail.com", "b@gmail.com"]

//         // Fetch users by email and return only IDs
//         const students = await User.find(
//             { email: { $in: studentEmails } },
//             { _id: 1 }
//         );

//         const studentIds = students.map(user => user._id);


//         /* ===============================
//            3. Handle attachment upload
//         =============================== */


//         if (req.file?.path) {

//             const uploadedFile = await uploadOnCloudinary(req.file.path);

//             if (!uploadedFile?.secure_url) {
//                 return res.status(500).json({
//                     success: false,
//                     message: "File upload failed"
//                 });
//             }

//             attachmentUrl = uploadedFile.secure_url;
//         }

//         /* ===============================
//            4. Create announcement
//         =============================== */

//         const announcement = await Announcement.create({
//             title,
//             content,
//             course,
//             teacher,
//             createdAt: Date.now(),
//             attachmentType: attachmentUrl ? attachmentType : undefined,
//             attachment: attachmentUrl
//         });

//         // studentIds.forEach(studentId => {
//         //     const sockets = userSocketMap[studentId] || [];

//         //     sockets.forEach(socketId => {
//         //         io.to(socketId).emit("newAnnouncement", announcement);
//         //     });
//         // });

//         io.on("connection", (socket) => {

//             socket.on("joinCourse", (courseId) => {
//                 socket.join(courseId);
//                 io.to(courseId).emit("newAnnouncement", announcement);
//             });


//         });



//         return res.status(201).json({
//             success: true,
//             message: "Announcement created successfully",
//             announcement
//         });

//     } catch (error) {
//         console.error("Create Announcement Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };

const createAnnouncement = async (req, res) => {
    try {
        const { title, content, attachmentType } = req.body;
        const teacher = req.user._id;
        const courseId = req.course._id;

        let attachmentUrl = null;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (req.file?.path) {
            const uploaded = await uploadOnCloudinary(req.file.path);
            attachmentUrl = uploaded.secure_url;
        }

        const announcement = await Announcement.create({
            title,
            content,
            course: courseId,
            teacher,
            attachment: attachmentUrl,
            attachmentType: attachmentUrl ? attachmentType : undefined,
            createdAt: Date.now()
        });

        // 🔥 THIS IS THE ONLY SOCKET LINE YOU NEED
        io.to(courseId.toString()).emit("newAnnouncement", announcement);

        return res.status(201).json({
            success: true,
            announcement
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const { courseId } = req.query;
        const userId = req.user?._id;
        const userEmail = req.user?.email;
        const isCourseAdmin = req.isCourseAdmin;
        const iscourseMember = req.isCourseMember

        if (!iscourseMember) {
            return res.status(403).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        /* ===============================
           1. Validate inputs
        =============================== */

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user"
            });
        }

        /* ===============================
           2. Check course existence
        =============================== */

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        /* ===============================
           3. Check user access (teacher or student)
        =============================== */

        const isTeacher =
            course.teacher?.toString() === userId.toString();

        const isStudent =
            Array.isArray(course.students) &&
            course.students.includes(userEmail);

        if (!isTeacher && !isStudent) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course"
            });
        }

        /* ===============================
           4. Fetch announcements
        =============================== */

        const announcements = await Announcement.find({ course: courseId })
            .populate("teacher", "fullName email")
            .sort({ createdAt: -1 });

        /* ===============================
           5. Response
        =============================== */

        return res.status(200).json({
            success: true,
            announcements,
            isCourseAdmin
        });

    } catch (error) {
        console.error("Get Announcements Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const announcementController = {
    createAnnouncement,
    getAnnouncements,
};

export default announcementController;