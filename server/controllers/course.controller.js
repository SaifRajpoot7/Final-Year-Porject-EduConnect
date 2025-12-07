import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mailSender from "../utils/mailSender.js"; // custom utility for sending emails
// import {
//     enrollmentEmailTemplate,
//     inviteToJoinPlatformTemplate,
// } from "../utils/emailTemplates.js";

const createCourse = async (req, res) => {
    try {
        const { title, description, thumbnailType, placeholderTitle, courseImage } = req.body;
        const teacherId = req.user?._id;

        if (!teacherId) return res.status(401).json({ success: false, message: "User not authenticated" });
        if (!title || !description || !thumbnailType )
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
        const userId = req.user._id; // or any user ID

        const courses = await Course.find({
            $or: [
                { teacher: userId },           // user is the teacher
                { students: userId },          // user is enrolled as a student
            ]                // optional: ignore deleted courses
        })

        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id)
            .populate("teacher", "fullName")
            .populate("students", "fullName");

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
        const { courseId, students } = req.body; // array of emails
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        for (const email of students) {
            let user = await User.findOne({ email });

            if (!user) {
                await mailSender({
                    email,
                    subject: "Invitation to join EduConnect",
                    body: inviteToJoinPlatformTemplate({ courseName: course.name }),
                });
            } else {
                await mailSender({
                    email,
                    subject: "Course Enrollment Confirmation",
                    body: enrollmentEmailTemplate({ name: user.fullName, courseName: course.name }),
                });
            }

            if (!course.students.includes(user._id)) {
                course.students.push(user._id);
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
    updateCourse,
    deleteCourse,
    addStudentsToCourse,
    getCoursesByTeacher,
    getCoursesByStudent,
};

export default courseController;