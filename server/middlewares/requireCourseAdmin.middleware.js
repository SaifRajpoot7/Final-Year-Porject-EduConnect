import Course from '../models/course.model.js';

// Middleware to check if current user is the teacher of the course
const requireCourseAdmin = async (req, res, next) => {
    try {
        const courseId = req.query.courseId;
        if (!courseId) {
            return res.status(400).json({ success: false, message: 'Course ID is required' });
        }

        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if the current user is the teacher of this course
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not the teacher of this course' });
        }

        // Attach course to request for further use if needed
        req.course = course;
        next();
    } catch (error) {
        console.error('Course Admin Middleware Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default requireCourseAdmin;
