import express from "express";
import lectureController from "../controllers/lecture.controller.js";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import requireCourseAdmin from "../middlewares/requireCourseAdmin.middleware.js";
import courseRole from "../middlewares/courseRole.middleware.js";

const lectureRouter = express.Router();

// Get All Lectures Specific to a user
lectureRouter.get("/all", requireAuth, lectureController.getAllLecturesByUser);

// Create/Schedule Lecture (Admin only)
lectureRouter.post("/create", requireAuth, requireCourseAdmin, lectureController.scheduleLecture);

// Get all Lectures specific to a course
lectureRouter.get("/course/:courseId", requireAuth, courseRole, lectureController.getCourseLectures);

// Get Single Lecture
lectureRouter.get("/:lectureId", requireAuth, lectureController.getLecture);

// Join / Leave (Student & Teacher)
lectureRouter.post("/:lectureId/join", requireAuth, lectureController.joinLecture);
lectureRouter.post("/:lectureId/leave", requireAuth, lectureController.leaveLecture);
lectureRouter.get("/:lectureId/attendance", requireAuth, lectureController.getLectureAttendance);

// End Live Lecture (Admin only)
lectureRouter.post("/:lectureId/end", requireAuth, lectureController.endLecture);

// Attendance (Manual trigger if needed, otherwise handled in endLecture)
lectureRouter.post("/:lectureId/finalize-attendance", requireAuth, lectureController.finalizeAttendance);

export default lectureRouter;