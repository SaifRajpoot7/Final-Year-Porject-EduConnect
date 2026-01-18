import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mailSender from "../utils/mailSender.js"; // custom utility for sending emails
import {
    enrollmentEmailTemplate,
    inviteToJoinPlatformTemplate,
} from "../utils/emailTemplates.js";
import mongoose from "mongoose";
import Assignment from "../models/assignments/assignment.model.js";
import Lecture from "../models/lecture.model.js"
import Quiz from "../models/quiz/quiz.model.js";
import AssignmentSubmission from "../models/assignments/assignmentSubmission.model.js";
import QuizSubmission from "../models/quiz/quizSubmission.model.js";

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

        // 1. Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // 2. Fetch course with populated teacher
        const course = await Course.findById(id).populate(
            "teacher",
            "fullName"
        );

        // 3. Not found check
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        // 4. Success response
        res.status(200).json({
            success: true,
            courseData: course,
        });

    } catch (error) {
        console.error("getCourseDetails error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
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

const courseTeacher = async (req, res) => {
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
        const course = await Course.findById(courseId)
            .populate("teacher", "fullName email");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const teacher = course.teacher

        return res.status(200).json({
            success: true,
            teacher: teacher,
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

const courseMember = async (req, res) => {
    if (req.isCourseMember) {
        res.status(200).json({
            success: true,
            message: 'User is member',
        });
    }
    else {
        res.status(400).json({
            success: false,
            message: 'User is not member',
        });
    }
}

const getCourseOverviewCards = async (req, res) => {
    try {
        const { id } = req.params; // Assumes route is like /api/course/:id/overview
        const courseId = id;

        // 1. Setup Date Ranges
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // 2. Fetch Metrics in Parallel
        const [course, activeAssignments, activeQuizzes, upcomingLectures] = await Promise.all([
            Course.findById(courseId), // Fetch the course document

            // Active Assignments
            Assignment.countDocuments({
                course: courseId,
                dueDate: { $gte: startOfToday }
            }),

            // Active Quizzes
            Quiz.countDocuments({
                course: courseId,
                dueDate: { $gte: startOfToday }
            }),

            // Upcoming Lectures (Today)
            Lecture.countDocuments({
                course: courseId,
                status: 'upcoming',
                scheduledStart: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            })
        ]);

        // 3. CRITICAL SAFETY CHECK
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // 4. Get Total Students
        // standard safety check (?.) in case students array is undefined
        const totalStudents = course.students ? course.students.length : 0;

        // 5. Return Response
        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                activeAssignments,
                activeQuizzes,
                upcomingLectures
            }
        });

    } catch (error) {
        console.error("Course Overview Cards Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course overview"
        });
    }
};

const getStudentPerformanceForCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        const courseId = req.query.courseId; // Or req.params.courseId

        // 1. Calculate Date Range (Last 5 Weeks)
        const today = new Date();
        const fiveWeeksAgo = new Date();
        fiveWeeksAgo.setDate(today.getDate() - 35);

        // 2. FETCH TASKS FOR THIS COURSE FIRST
        // We need the IDs of assignments/quizzes that belong to this specific course
        const [courseAssignments, courseQuizzes] = await Promise.all([
            Assignment.find({ course: courseId }).select('_id'),
            Quiz.find({ course: courseId }).select('_id')
        ]);

        // Extract IDs into arrays
        const assignmentIds = courseAssignments.map(a => a._id);
        const quizIds = courseQuizzes.map(q => q._id);

        // 3. FETCH SUBMISSIONS USING THE IDs
        const [assignmentSubmissions, quizSubmissions] = await Promise.all([

            // Find submissions where the 'assignment' field matches one of our Course Assignment IDs
            AssignmentSubmission.find({
                student: userId,
                assignment: { $in: assignmentIds }, // <--- FILTER BY ID HERE
                createdAt: { $gte: fiveWeeksAgo },
                marksObtained: { $ne: null }
            }).populate('assignment', 'maxMarks title'), // We still populate to get maxMarks

            // Find submissions where the 'quiz' field matches one of our Course Quiz IDs
            QuizSubmission.find({
                student: userId,
                quiz: { $in: quizIds }, // <--- FILTER BY ID HERE
                createdAt: { $gte: fiveWeeksAgo },
            }).populate('quiz', 'maxMarks title')
        ]);

        // 4. Initialize Weekly Buckets (Same logic as before)
        const weeklyData = [];
        for (let i = 4; i >= 0; i--) {
            const endOfWeek = new Date();
            endOfWeek.setDate(today.getDate() - (i * 7));
            const startOfWeek = new Date();
            startOfWeek.setDate(today.getDate() - ((i + 1) * 7));

            startOfWeek.setHours(0, 0, 0, 0);
            endOfWeek.setHours(23, 59, 59, 999);

            weeklyData.push({
                weekLabel: `Week ${5 - i}`,
                startDate: startOfWeek,
                endDate: endOfWeek,
                totalPercentage: 0,
                submissionCount: 0
            });
        }

        // 5. Helper to calculate percentage
        const processGrade = (submission, type) => {
            const date = new Date(submission.createdAt || submission.submittedAt);
            let obtained = 0;
            let max = 0;

            if (type === 'assignment') {
                obtained = submission.marksObtained;
                max = submission.assignment?.maxMarks;
            } else {
                obtained = submission.obtainedMarks;
                max = submission.quiz?.maxMarks;
            }

            if (!max || max === 0) return;

            const percentage = (obtained / max) * 100;
            const bucket = weeklyData.find(w => date >= w.startDate && date <= w.endDate);

            if (bucket) {
                bucket.totalPercentage += percentage;
                bucket.submissionCount += 1;
            }
        };

        // 6. Process Data
        assignmentSubmissions.forEach(sub => processGrade(sub, 'assignment'));
        quizSubmissions.forEach(sub => processGrade(sub, 'quiz'));

        const chartData = weeklyData.map(week => ({
            name: week.weekLabel,
            dateRange: `${week.startDate.toLocaleDateString()} - ${week.endDate.toLocaleDateString()}`,
            performance: week.submissionCount > 0
                ? Math.round(week.totalPercentage / week.submissionCount)
                : 0
        }));

        return res.status(200).json({
            success: true,
            data: chartData
        });

    } catch (error) {
        console.error("Course Performance Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getCourseAssignmentQuizStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id} = req.params; 
        const courseId = id;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        // 1. Fetch Course Tasks (Assignments & Quizzes)
        // We need these first to know WHICH submissions to look for.
        const [courseAssignments, courseQuizzes] = await Promise.all([
            Assignment.find({ course: courseId }).select('_id dueDate'),
            Quiz.find({ course: courseId }).select('_id dueDate')
        ]);

        const assignmentIds = courseAssignments.map(a => a._id);
        const quizIds = courseQuizzes.map(q => q._id);

        // 2. Fetch User's Submissions for THESE tasks only
        // Optimized: We use { $in: assignmentIds } to avoid fetching unrelated submissions
        const [myAssignmentSubmissions, myQuizSubmissions] = await Promise.all([
            AssignmentSubmission.find({ 
                student: userId,
                assignment: { $in: assignmentIds } 
            }).select('assignment'),

            QuizSubmission.find({ 
                student: userId,
                quiz: { $in: quizIds } 
            }).select('quiz')
        ]);

        // 3. Create Sets for Fast Lookup (O(1))
        const submittedAssignmentIds = new Set(
            myAssignmentSubmissions.map(s => s.assignment.toString())
        );
        const submittedQuizIds = new Set(
            myQuizSubmissions.map(s => s.quiz.toString())
        );

        // 4. Calculate Metrics
        const now = new Date();

        // --- Assignments Logic ---
        // Completed: User has submitted
        const assignmentsCompleted = submittedAssignmentIds.size;
        
        let assignmentsPending = 0;
        let assignmentsMissed = 0;

        courseAssignments.forEach(assignment => {
            // If NOT submitted...
            if (!submittedAssignmentIds.has(assignment._id.toString())) {
                if (new Date(assignment.dueDate) > now) {
                    assignmentsPending++; // Due future
                } else {
                    assignmentsMissed++;  // Due past
                }
            }
        });

        // --- Quizzes Logic ---
        // Attempted: User has submitted
        const quizzesAttempted = submittedQuizIds.size;
        
        let quizzesMissed = 0;
        
        courseQuizzes.forEach(quiz => {
            // If NOT submitted...
            if (!submittedQuizIds.has(quiz._id.toString())) {
                if (new Date(quiz.dueDate) < now) {
                    quizzesMissed++; // Deadline passed
                }
            }
        });

        // 5. Format for Chart
        const chartData = [
            { name: "Assignments Completed", value: assignmentsCompleted, fill: "#00C49F" },
            { name: "Assignments Pending", value: assignmentsPending, fill: "#FFBB28" },
            { name: "Deadlines Missed", value: assignmentsMissed, fill: "#FF8042" },
            { name: "Quizzes Attempted", value: quizzesAttempted, fill: "#0088FE" },
            { name: "Quizzes Missed", value: quizzesMissed, fill: "#FF8042" }
        ];

        return res.status(200).json({
            success: true,
            data: chartData
        });

    } catch (error) {
        console.error("Course Assignment/Quiz Status Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch course status data" 
        });
    }
};

const getCourseStudentPerformance = async (req, res) => {
    try {
        const teacherId = req.user._id;
        
        // Retrieve Course ID from params or query string
        const {id} = req.params;
        const courseId = id;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        // 1. Build Query Object
        // We filter by BOTH the teacher (to ensure ownership) AND the course
        const taskQuery = { 
            teacher: teacherId,
            course: courseId 
        };

        // 2. Get all Task IDs for this specific course & teacher
        const [assignments, quizzes] = await Promise.all([
            Assignment.find(taskQuery).select('_id maxMarks'),
            Quiz.find(taskQuery).select('_id maxMarks')
        ]);

        // Create Maps for O(1) lookup of Max Marks
        const assignmentMaxMap = new Map(assignments.map(a => [a._id.toString(), a.maxMarks]));
        const quizMaxMap = new Map(quizzes.map(q => [q._id.toString(), q.maxMarks]));

        const assignmentIds = assignments.map(a => a._id);
        const quizIds = quizzes.map(q => q._id);

        // 3. Fetch all student submissions for these specific tasks
        // Since 'assignmentIds' and 'quizIds' are already filtered by course,
        // we don't need to filter by course again in the submission query.
        const [assignmentSubs, quizSubs] = await Promise.all([
            AssignmentSubmission.find({ 
                assignment: { $in: assignmentIds },
                marksObtained: { $ne: null } // Only graded ones
            }).select('student assignment marksObtained'),
            
            QuizSubmission.find({ 
                quiz: { $in: quizIds },
                obtainedMarks: { $exists: true } // Only graded ones
            }).select('student quiz obtainedMarks')
        ]);

        // 4. Aggregate Scores per Student
        // Structure: { studentId: { obtained: 0, max: 0 } }
        const studentStats = {};

        // Helper to accumulate stats
        const addScore = (studentId, obtained, max) => {
            if (!max || max === 0) return; // Skip invalid max marks
            
            if (!studentStats[studentId]) {
                studentStats[studentId] = { obtained: 0, max: 0 };
            }
            studentStats[studentId].obtained += obtained;
            studentStats[studentId].max += max;
        };

        // Process Assignments
        assignmentSubs.forEach(sub => {
            const max = assignmentMaxMap.get(sub.assignment.toString()) || 0;
            addScore(sub.student.toString(), sub.marksObtained, max);
        });

        // Process Quizzes
        quizSubs.forEach(sub => {
            const max = quizMaxMap.get(sub.quiz.toString()) || 0;
            addScore(sub.student.toString(), sub.obtainedMarks, max);
        });

        // 5. Categorize Students into Buckets
        const buckets = {
            weak: 0,      // 0-40%
            average: 0,   // 41-60%
            good: 0,      // 61-80%
            excellent: 0  // 81-100%
        };

        Object.values(studentStats).forEach(stat => {
            const percentage = (stat.obtained / stat.max) * 100;

            if (percentage <= 40) {
                buckets.weak++;
            } else if (percentage <= 60) {
                buckets.average++;
            } else if (percentage <= 80) {
                buckets.good++;
            } else {
                buckets.excellent++;
            }
        });

        // 6. Format Data for Frontend Chart
        const chartData = [
            { name: "Weak (0-40%)", value: buckets.weak, fill: "#ef4444" },      // Red
            { name: "Average (41-60%)", value: buckets.average, fill: "#f59e0b" }, // Orange/Yellow
            { name: "Good (61-80%)", value: buckets.good, fill: "#3b82f6" },       // Blue
            { name: "Excellent (81-100%)", value: buckets.excellent, fill: "#10b981" } // Green
        ];

        return res.status(200).json({
            success: true,
            data: chartData
        });

    } catch (error) {
        console.error("Course Student Performance Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch student performance data" 
        });
    }
};

const getCourseTeacherWorkload = async (req, res) => {
    try {
        const teacherId = req.user._id;
        
        // Retrieve Course ID from params or query
        const courseId = req.params.id;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        // 1. Fetch Assignments for THIS COURSE
        // We need IDs first to calculate pending reviews correctly for this specific course.
        const courseAssignments = await Assignment.find({ 
            teacher: teacherId,
            course: courseId 
        }).select('_id');
        
        const assignmentIds = courseAssignments.map(a => a._id);

        // 2. Fetch Metrics in Parallel
        const [
            lecturesDelivered,
            quizzesCreated,
            pendingReviews
        ] = await Promise.all([
            
            // Lectures Delivered: Filter by Teacher AND Course AND Status='ended'
            Lecture.countDocuments({ 
                teacher: teacherId, 
                course: courseId,
                status: 'ended' 
            }),

            // Quizzes Created: Filter by Teacher AND Course
            Quiz.countDocuments({ 
                teacher: teacherId,
                course: courseId
            }),

            // Pending Reviews: Submissions for THIS course's assignments only
            AssignmentSubmission.countDocuments({
                assignment: { $in: assignmentIds },
                status: { $ne: 'graded' } 
            })
        ]);

        // 3. Construct Data Object
        const workloadData = [
            { 
                title: "Lectures Delivered", 
                count: lecturesDelivered, 
                icon: "Video", 
                color: "#3b82f6" // Blue
            },
            { 
                title: "Assignments Created", 
                count: courseAssignments.length, 
                icon: "FileText", 
                color: "#10b981" // Green
            },
            { 
                title: "Quizzes Created", 
                count: quizzesCreated, 
                icon: "HelpCircle", 
                color: "#f59e0b" // Yellow
            },
            { 
                title: "Pending Reviews", 
                count: pendingReviews, 
                icon: "Clock", 
                color: "#ef4444" // Red
            }
        ];

        return res.status(200).json({
            success: true,
            data: workloadData
        });

    } catch (error) {
        console.error("Course Workload Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch course workload stats" 
        });
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
    courseMember,
    courseTeacher,
    getCourseOverviewCards,
    getStudentPerformanceForCourse,
    getCourseAssignmentQuizStatus,
    getCourseStudentPerformance,
    getCourseTeacherWorkload,
};

export default courseController;