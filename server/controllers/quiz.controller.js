import Quiz from "../models/quiz/quiz.model.js";
import Course from "../models/course.model.js";
import QuizSubmission from "../models/quiz/quizSubmission.model.js";

const createQuiz = async (req, res) => {
    try {
        const teacher = req.user._id
        const { course, title, questions, dueDate, totalQuestions } = req.body;

        // 1. Validate required fields
        if (!course || !title || !questions || !dueDate || !totalQuestions) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ success: false, message: "Questions must be a non-empty array." });
        }

        for (const [index, q] of questions.entries()) {
            if (!q.questionText || !q.options || !Array.isArray(q.options) || q.options.length < 2 || q.correctOptionIndex == null) {
                return res.status(400).json({
                    success: false,
                    message: `Question at index ${index} is invalid. Each question must have questionText, at least 2 options, and correctOptionIndex.`,
                });
            }
        }

        // 2. Check if course exists
        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        // 3. Set maxMarks = totalQuestions
        const maxMarks = totalQuestions;

        // 4. Create and save quiz
        const quiz = new Quiz({
            course,
            teacher,
            title,
            questions,
            dueDate,
            totalQuestions,
            maxMarks,
        });

        await quiz.save();

        res.status(201).json({ success: true, message: "Quiz created successfully.", quiz });
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getAllCourseQuiz = async (req, res) => {
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
        const quizzes = await Quiz.find({ course: courseId })
            .populate("course", "_id title")
            .sort({ createdAt: -1 });

        // Prepare titles based on user role
        let titles = [];
        if (isCourseAdmin) {
            titles = ["Sr", "Title", "Due Date", "Total Marks", "Total Submissions"];
        } else {
            titles = ["Sr", "Title", "Due Date", "Total Marks", "Submission Date", "Result"];
        }

        // Prepare values array
        const values = await Promise.all(quizzes.map(async (quiz, index) => {
            if (isCourseAdmin) {
                return {
                    _id: quiz._id,
                    Sr: index + 1,
                    title: quiz.title,
                    dueDate: quiz.dueDate,
                    maxMarks: quiz.maxMarks,
                    totalSubmissions: quiz.totalSubmissions,
                };
            } else {
                // Find submission of current user
                const submission = await QuizSubmission.findOne({ quiz: quiz._id, student: userId });
                return {
                    _id: quiz._id,
                    Sr: index + 1,
                    title: quiz.title,
                    dueDate: quiz.dueDate,
                    maxMarks: quiz.maxMarks,
                    submission: submission ? submission.submittedFile : null,
                    submissionDate: submission ? submission.submittedAt : null,
                    result: submission ? submission.obtainedMarks : null,
                    questions: quiz.questions
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
        console.error("Error fetching Quizzes:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const allSubmissionOfQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        // 1. Check if the assignment exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }

        // 2. Fetch all submissions for this assignment
        const submissions = await QuizSubmission.find({ quiz: quizId })
            .populate({
                path: "student", // assuming 'student' field in AssignmentSubmission points to User
                select: "fullName email"
            });

        // 3. Format the response
        const formattedSubmissions = submissions.map(sub => ({
            title: quiz.title,
            dueDate: quiz.dueDate,
            maxMarks: quiz.maxMarks,
            submissionDate: sub.submittedAt,
            result: sub.obtainedMarks,
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

const submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // [{ questionIndex: 0, selectedOptionIndex: 2 }, ...]
        const { quizId } = req.params;
        const { courseId } = req.query;
        const userId = req.user._id; // logged in user
        const isCourseAdmin = req.isCourseAdmin;

        // 1. Check if user is a course admin
        if (isCourseAdmin) {
            return res.status(403).json({ success: false, message: "Admins cannot attempt quiz." });
        }

        // 2. Check course existence
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        // 3. Check quiz existence
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        // 4. Check quiz due date
        const now = new Date();
        if (quiz.dueDate && now > quiz.dueDate) {
            return res.status(400).json({ success: false, message: "Quiz submission is past due date." });
        }

        // 5. Check if submission already exists
        let existingSubmission = await QuizSubmission.findOne({
            quiz: quizId,
            student: userId,
        });

        if (existingSubmission) {
            return res.status(400).json({ success: false, message: "You have already attempted this quiz." });
        }

        // 6. Calculate obtained marks
        let obtainedMarks = 0;
        if (Array.isArray(answers) && answers.length > 0) {
            answers.forEach(answer => {
                const question = quiz.questions[answer.questionIndex];
                if (question && question.correctOptionIndex === answer.selectedOptionIndex) {
                    obtainedMarks += 1;
                }
            });
        }

        // 7. Create new submission
        const newSubmission = new QuizSubmission({
            quiz: quizId,
            student: userId,
            answers,
            obtainedMarks,
            submittedAt: new Date(),
        });

        // 8. Increment total submissions for the quiz
        quiz.totalSubmissions = (quiz.totalSubmissions || 0) + 1;

        await newSubmission.save();
        await quiz.save();

        return res.status(201).json({
            success: true,
            message: "Quiz submitted successfully.",
        });

    } catch (error) {
        console.error("Submit Quiz Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// const getAllQuizByUser = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const userEmail = req.user?.email;

//     // Authentication check
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authenticated"
//       });
//     }

//     /**
//      * 1. Quiz created by the user (Teacher)
//      */
//     const quizFromMyCreation = await Quiz.find({
//       teacher: userId,
//     })
//       .populate({
//         path: "course",
//         select: "title"
//       })
//       .sort({ scheduledStart: 1 }); // nearest first

//     /**
//      * 2. Quiz where user is enrolled as student
//      *    - Find courses where user is a student
//      *    - Then find upcoming lectures for those courses
//      */
//     const enrolledCourses = await Course.find(
//       { students: userEmail },
//       { _id: 1 }
//     );

//     const enrolledCourseIds = enrolledCourses.map(course => course._id);

//     const quizFromEnrollment = await Quiz.find({
//       course: { $in: enrolledCourseIds },
//     })
//       .populate({
//         path: "course",
//         select: "title"
//       })
//       .sort({ scheduledStart: 1 }); // nearest first

//     return res.status(200).json({
//       success: true,
//       quizFromMyCreation,
//       quizFromEnrollment
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


const getAllQuizByUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    const userEmail = req.user?.email;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    /**
     * 1. Quiz created by the user (Teacher)
     */
    const quizFromMyCreation = await Quiz.find({
      teacher: userId,
    })
      .populate({
        path: "course",
        select: "title",
      })
      .sort({ createdAt: -1 });

    /**
     * 2. Quiz where user is enrolled as student
     */
    const enrolledCourses = await Course.find(
      { students: userEmail },
      { _id: 1 }
    );

    const enrolledCourseIds = enrolledCourses.map(course => course._id);

    const quizFromEnrollment = await Quiz.find({
      course: { $in: enrolledCourseIds },
    })
      .populate({
        path: "course",
        select: "title",
      })
      .sort({ createdAt: -1 })
      .lean(); // IMPORTANT for mutation

    /**
     * 3. Fetch submissions for current student
     */
    const submissions = await QuizSubmission.find({
      student: userId,
      quiz: { $in: quizFromEnrollment.map(q => q._id) },
    })
      .populate({
        path: "student",
        select: "fullName email",
      })
      .lean();

    /**
     * 4. Map submissions by quizId for O(1) access
     */
    const submissionMap = new Map();
    submissions.forEach(sub => {
      submissionMap.set(sub.quiz.toString(), sub);
    });

    /**
     * 5. Attach submission info to each quiz
     */
    const enrichedQuizFromEnrollment = quizFromEnrollment.map(quiz => {
      const submission = submissionMap.get(quiz._id.toString());

      return {
        ...quiz,
        submission: submission
          ? {
              _id: submission._id,
              submittedAt: submission.submittedAt,
              result: submission.obtainedMarks,
              student: {
                fullName: submission.student?.fullName,
                email: submission.student?.email,
              },
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      quizFromMyCreation,
      quizFromEnrollment: enrichedQuizFromEnrollment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const quizController = {
    createQuiz,
    getAllCourseQuiz,
    allSubmissionOfQuiz,
    submitQuiz,
    getAllQuizByUser,
}

export default quizController;