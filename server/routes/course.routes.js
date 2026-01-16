import express from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import courseController from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import requireCourseAdmin from "../middlewares/requireCourseAdmin.middleware.js";
import courseRole from "../middlewares/courseRole.middleware.js";

const courseRouter = express.Router();

// Teacher/Admin routes
courseRouter.post("/create", requireAuth, upload.single('courseImage'), courseController.createCourse);
courseRouter.put("/:id", requireAuth, courseController.updateCourse);
courseRouter.delete("/:id", requireAuth, courseController.deleteCourse);
courseRouter.post("/:id/add-students", requireAuth, requireCourseAdmin, courseController.addStudentsToCourse);

// Public routes
courseRouter.get("/all", requireAuth, courseController.getAllCourses);
courseRouter.get("/course-member", requireAuth, courseRole ,courseController.courseMember);

// Role-based filtered routes
courseRouter.get("/teacher/:teacherId", requireAuth, courseController.getCoursesByTeacher);
courseRouter.get("/student/:studentId", requireAuth, courseController.getCoursesByStudent);

courseRouter.get("/:id", requireAuth, courseController.getCourseDetails);
courseRouter.get("/:id/students", requireAuth, courseController.getCourseStudents);



export default courseRouter;
