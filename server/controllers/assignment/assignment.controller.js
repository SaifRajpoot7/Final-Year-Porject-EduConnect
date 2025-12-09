import Course from "../../models/course.model.js";
import Assignment from "../../models/assignments/assignment.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

export const createAssignment = async (req, res) => {
    try {
        const { title, courseId, dueDate, maxMarks } = req.body;

        // Validate required fields
        if (!title || !courseId || !dueDate) {
            return res.status(400).json({ success: false, message: 'Title, courseId, and dueDate are required' });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // // Ensure the logged-in user is the teacher of the course
        // if (course.teacher.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ success: false, message: 'You are not the teacher of this course' });
        // }
        let assignmentData = {
            title: title.trim(),
            course: courseId,
            teacher: req.user._id,
            dueDate,
            maxMarks,
        };
        // Handle file attachments if any
        // Upload to Cloudinary
        const result = await uploadOnCloudinary(req.file.path);
        assignmentData.attachments = result.secure_url; // save the Cloudinary URL

        // Create assignment
        const assignment = await Assignment.create(assignmentData);
        // Increment assignmentCount by 1
        await Course.findByIdAndUpdate(
            assignment.course,
            { $inc: { assignmentCount: 1 } }
        );
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        console.error('Create Assignment Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const assignmentController = {
    createAssignment
};

export default assignmentController;