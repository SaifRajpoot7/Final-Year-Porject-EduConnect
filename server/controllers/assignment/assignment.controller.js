import Course from "../../models/course.model.js";
import Assignment from "../../models/assignments/assignment.model.js";
import AssignmentSubmission from "../../models/assignments/assignmentSubmission.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const createAssignment = async (req, res) => {
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

const getAllCourseAssignment = async (req, res) => {
    try {
        const { courseId } = req.query;
        const userId = req.user._id; // Assuming user ID is attached to req.user
        const isCourseAdmin = req.isCourseAdmin;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "courseId is required",
            });
        }

        // Fetch assignments for the course
        const assignments = await Assignment.find({ course: courseId })
            .populate("course", "_id title")
            .sort({ createdAt: -1 });

        // Prepare titles based on user role
        let titles = [];
        if (isCourseAdmin) {
            titles = ["Sr", "Title", "Assignment File", "Due Date", "Total Marks", "Total Submissions", "Total Graded"];
        } else {
            titles = ["Sr", "Title", "Assignment File", "Due Date", "Total Marks", "Submission", "Submission Date", "Result", "Feedback"];
        }

        // Prepare values array
        const values = await Promise.all(assignments.map(async (assignment, index) => {
            if (isCourseAdmin) {
                // Count total submissions for this assignment
                const totalSubmissions = await AssignmentSubmission.countDocuments({ assignment: assignment._id });
                const totalGraded = await AssignmentSubmission.countDocuments({
                    assignment: assignment._id,
                    status: "graded"
                });
                return {
                    _id: assignment._id,
                    Sr: index + 1,
                    title: assignment.title,
                    attachments: assignment.attachments, // assuming attachments field exists
                    dueDate: assignment.dueDate,
                    maxMarks: assignment.maxMarks,
                    totalSubmissions,
                    totalGraded,
                };
            } else {
                // Find submission of current user
                const submission = await AssignmentSubmission.findOne({ assignment: assignment._id, student: userId });
                return {
                    _id: assignment._id,
                    Sr: index + 1,
                    title: assignment.title,
                    attachments: assignment.attachments,
                    dueDate: assignment.dueDate,
                    maxMarks: assignment.maxMarks,
                    submission: submission ? submission.submittedFile : null,
                    submissionDate: submission ? submission.submittedAt : null,
                    result: submission ? submission.marksObtained : null,
                    feedback: submission ? submission.feedback : null,
                };
            }
        }));

        return res.status(200).json({
            success: true,
            isCourseAdmin,
            titles,
            values
        });

    } catch (error) {
        console.error("Error fetching assignments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const submitAssignment = async (req, res) => {
    try {
        const { courseId, assignmentId } = req.query;
        const userId = req.user._id; // logged in user
        const isCourseAdmin = req.isCourseAdmin;

        // 1. Check if user is a course admin
        if (isCourseAdmin) {
            return res.status(403).json({ success: false, message: "Admins cannot submit assignments." });
        }

        // 2. Check course existence
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        // 3. Check assignment existence
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found." });
        }

        // 4. Check file upload
        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        // 5. Check assignment due date
        const now = new Date();
        if (assignment.dueDate && now > assignment.dueDate) {
            return res.status(400).json({ success: false, message: "Assignment submission is past due date." });
        }

        // 6. Check if submission already exists
        let submission = await AssignmentSubmission.findOne({
            assignment: assignmentId,
            student: userId,
        });

        // Upload file to Cloudinary
        const result = await uploadOnCloudinary(req.file.path);

        if (submission) {
            // 6a. If already graded
            if (submission.status === "graded") {
                return res.status(400).json({ success: false, message: "Submission already graded, cannot update." });
            }
            // 6b. If not graded, update submission
            submission.submittedFile = result.secure_url;
            submission.submittedAt = new Date();
            submission.version = (submission.version || 1) + 1;
            await submission.save();
            return res.status(200).json({ success: true, message: "Submission updated successfully.", submission });
        } else {
            // 6c. Create new submission
            const newSubmission = new AssignmentSubmission({
                assignment: assignmentId,
                student: userId,
                submittedFile: result.secure_url,
                submittedAt: new Date(),
                version: 1,
                status: "submitted",
            });
            assignment.totalSubmissions = (assignment.totalSubmissions || 0) + 1;
            await newSubmission.save();
            await assignment.save();
            return res.status(201).json({ success: true, message: "Assignment submitted successfully.", submission: newSubmission });
        }
    } catch (error) {
        console.error("Submit Assignment Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const allSubmissionOfAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        // 1. Check if the assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        // 2. Fetch all submissions for this assignment
        const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
            .populate({
                path: "student", // assuming 'student' field in AssignmentSubmission points to User
                select: "fullName email"
            });

        // 3. Format the response
        const formattedSubmissions = submissions.map(sub => ({
            assignmentFile: assignment.attachments,  // or assignment.file depending on your schema
            title: assignment.title,
            dueDate: assignment.dueDate,
            maxMarks: assignment.maxMarks,
            submissionFile: sub.submittedFile,
            submissionDate: sub.submittedAt,
            result: sub.marksObtained,
            feedback: sub.feedback,
            studentName: sub.student?.fullName || "Unknown",
            studentEmail: sub.student?.email || "Unknown",
            submissionId: sub._id
        }));

        // 4. Send response
        return res.status(200).json({ success: true, submissions: formattedSubmissions });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marksObtained, feedback } = req.body;

        // Find the submission by assignmentId
        const submission = await AssignmentSubmission.findById(submissionId)
        const assignmentId = submission.assignment
        
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        // Update submission with marks, feedback, and status
        submission.marksObtained = marksObtained;
        submission.feedback = feedback;
        submission.status = "graded";

        await submission.save();

        // Update the totalGraded count in Assignment
        await Assignment.findByIdAndUpdate(assignmentId, { $inc: { totalGraded: 1 } });
        
        return res.status(200).json({
            success: true,
            message: "Submission graded successfully",
            submission
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


const assignmentController = {
    createAssignment,
    getAllCourseAssignment,
    submitAssignment,
    allSubmissionOfAssignment,
    gradeSubmission,
};

export default assignmentController;