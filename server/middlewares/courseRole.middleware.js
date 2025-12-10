import Course from '../models/course.model.js';

// Middleware to attach user's role in the course
const courseRole = async (req, res, next) => {
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

        // Check if the current user is the teacher/admin of this course
        const isAdmin = course.teacher.toString() === req.user._id.toString();

        // Attach info to the request
        req.course = course;
        req.isCourseAdmin = isAdmin;

        next();
    } catch (error) {
        console.error('Course Role Middleware Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default courseRole;
