import express from "express";
import assignmentController from "../../controllers/assignment/assignment.controller.js";
import requireAuth from "../../middlewares/requireAuth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import requireCourseAdmin from "../../middlewares/requireCourseAdmin.middleware.js";
import courseRole from "../../middlewares/courseRole.middleware.js";

const assignmentRouter = express.Router();

// Create
assignmentRouter.post("/create", requireAuth, upload.single('assignmentFile'), requireCourseAdmin, assignmentController.createAssignment);

// Get all
assignmentRouter.get("/all/course", requireAuth, courseRole, assignmentController.getAllCourseAssignment);

// Submit assignment
assignmentRouter.post("/submit", requireAuth, courseRole, upload.single('assignmentSubmissionFile'), assignmentController.submitAssignment);

assignmentRouter.get("/all/:assignmentId", requireAuth, requireCourseAdmin, assignmentController.allSubmissionOfAssignment);

assignmentRouter.patch("/grade/:submissionId", requireAuth, requireCourseAdmin, assignmentController.gradeSubmission);

export default assignmentRouter;
