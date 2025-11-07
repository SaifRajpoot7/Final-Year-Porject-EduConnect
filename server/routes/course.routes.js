import express from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import checkRole from "../middlewares/checkRole.middleware.js"; // custom role-based middleware
import courseController from "../controllers/course.controller.js";

const router = express.Router();

// Public routes
router.get("/", requireAuth, courseController.getAllCourses);
router.get("/:id", requireAuth, courseController.getCourseDetails);

// Teacher/Admin routes
router.post("/create", requireAuth, checkRole(["teacher", "admin"]), courseController.createCourse);
router.put("/:id", requireAuth, checkRole(["teacher", "admin"]), courseController.updateCourse);
router.delete("/:id", requireAuth, checkRole(["teacher", "admin"]), courseController.deleteCourse);
router.post("/add-students", requireAuth, checkRole(["teacher", "admin"]), courseController.addStudentsToCourse);

// Role-based filtered routes
router.get("/teacher/:teacherId", requireAuth, courseController.getCoursesByTeacher);
router.get("/student/:studentId", requireAuth, courseController.getCoursesByStudent);

export default router;
