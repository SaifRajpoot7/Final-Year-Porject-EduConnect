import express from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import courseController from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const courseRouter = express.Router();

// Public routes
courseRouter.get("/", requireAuth, courseController.getAllCourses);
courseRouter.get("/:id", requireAuth, courseController.getCourseDetails);

// Teacher/Admin routes
courseRouter.post("/create", requireAuth, upload.single('courseImage'), courseController.createCourse);
courseRouter.put("/:id", requireAuth, courseController.updateCourse);
courseRouter.delete("/:id", requireAuth, courseController.deleteCourse);
courseRouter.post("/add-students", requireAuth, courseController.addStudentsToCourse);

// Role-based filtered routes
courseRouter.get("/teacher/:teacherId", requireAuth, courseController.getCoursesByTeacher);
courseRouter.get("/student/:studentId", requireAuth, courseController.getCoursesByStudent);

export default courseRouter;
