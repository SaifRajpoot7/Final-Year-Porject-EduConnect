import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mailSender from "../utils/mailSender.js"; // custom utility for sending emails
import {
    enrollmentEmailTemplate,
    inviteToJoinPlatformTemplate,
} from "../utils/emailTemplates.js";

const createCourse = async (req, res) => {
    try {
        const { title, description, thumbnailType, placeholderTitle, } = req.body;
        const teacherId = req.user?._id;

        if (!teacherId) return res.status(401).json({ success: false, message: "User not authenticated" });
        if (!title || !description || !thumbnailType)
            return res.status(400).json({ success: false, message: "All required fields must be provided" });

        let courseData = {
            title: title.trim(),
            description: description.trim(),
            thumbnailType,
            teacher: teacherId,
        };
        // Handle thumbnailType specific logic
        if (thumbnailType === "courseImage") {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Course image must be uploaded" });
            }

            // Upload to Cloudinary
            const result = await uploadOnCloudinary(req.file.path);

            courseData.courseImage = result.secure_url; // save the Cloudinary URL
        } else if (thumbnailType === "placeholder") {
            if (!placeholderTitle) {
                return res.status(400).json({ success: false, message: "Placeholder title must be provided" });
            }
            courseData.placeholderTitle = placeholderTitle.trim();
        } else {
            return res.status(400).json({ success: false, message: "Invalid thumbnail type" });
        }

        const course = await Course.create(courseData);
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get logged-in user's email
        const user = await User.findById(userId).select("email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userEmail = user.email;

        const { page = 1, limit = 10, search = "", sort = "newest", type = "all" } = req.query;

        let filter = {
            title: { $regex: search, $options: "i" }, // search by title
        };

        // 2. Fix filtering based on email stored in students[]
        if (type === "all") {
            filter.$or = [
                { teacher: userId },        // teacher is still saved as ObjectId
                { students: userEmail }     // students saved as emails
            ];
        } 
        else if (type === "mine") {
            filter.teacher = userId;
        } 
        else if (type === "joined") {
            filter.students = userEmail;
        }

        // Sorting options
        let sortOption = {};
        if (sort === "newest") sortOption = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };
        if (sort === "title-asc") sortOption = { title: 1 };
        if (sort === "title-desc") sortOption = { title: -1 };

        // Pagination & fetch
        const total = await Course.countDocuments(filter);

        const courses = await Course.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            total,
            totalPages: Math.ceil(total / limit),
            page: Number(page),
            limit: Number(limit),
            courses,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id)
            .populate("teacher", "fullName")

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({ success: true, courseData: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCourseStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const courseId = id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        // Find course and populate students (assuming it's an array of emails or user IDs)
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }


        // Custom array logic
        const customStudents = await Promise.all(
            course.students.map(async (student) => {
                // Check if this student exists in User collection
                const user = await User.findOne({ email: student });
                if (user) {
                    return { name: user.fullName, email: user.email };
                } else {
                    return { email: student };
                }
            })
        );

        return res.status(200).json({
            success: true,
            students: customStudents,
        });

    } catch (error) {
        console.error("Error fetching course students:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user._id;
        const updates = req.body;

        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        // only creator/teacher/admin can update
        if (course.teacher.toString() !== teacherId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        Object.assign(course, updates);
        await course.save();

        res.status(200).json({ success: true, message: "Course updated successfully", course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user._id;

        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        if (course.teacher.toString() !== teacherId.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        course.isDeleted = true;
        await course.save();

        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addStudentsToCourse = async (req, res) => {
    try {
        const { students } = req.body; // array of emails
        const courseId = req.query.courseId;
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        for (const email of students) {
            if (course.students.includes(email)) { continue; }
            let user = await User.findOne({ email });

            if (!user) {
                const mailDetails = {
                    email,
                    subject: "Course Enrollment & Invitation to join EduConnect",
                    body: inviteToJoinPlatformTemplate({
                        name: email,
                        courseTitle: course.title,
                        signupUrl: `${process.env.CLIENT_URL}/signup`,
                    }),
                };

                await mailSender(mailDetails)
            } else {
                const mailDetails = {
                    email,
                    subject: "Course Enrollment | EduConnect",
                    body: enrollmentEmailTemplate({
                        name: user.fullName,
                        courseTitle: course.title,
                        url: `${process.env.CLIENT_URL}/course/${course._id}/dashboard`,
                    }),
                };

                await mailSender(mailDetails)
            }

            if (!course.students.includes(email)) {
                course.students.push(email);
                course.enrollmentCount += 1;
            }
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: "Students added successfully",
            totalStudents: course.students.length,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCoursesByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const courses = await Course.find({ teacher: teacherId, isDeleted: false })
            .select("name thumbnailType category enrollmentCount createdAt");

        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCoursesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const courses = await Course.find({ students: studentId, isDeleted: false })
            .select("name thumbnailType teacher category")
            .populate("teacher", "fullName email");

        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const courseController = {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getCourseStudents,
    updateCourse,
    deleteCourse,
    addStudentsToCourse,
    getCoursesByTeacher,
    getCoursesByStudent,
};

export default courseController;