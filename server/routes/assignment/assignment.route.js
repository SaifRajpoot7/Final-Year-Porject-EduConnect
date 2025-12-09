import express from "express";
import assignmentController from "../../controllers/assignment/assignment.controller.js";
import requireAuth from "../../middlewares/requireAuth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import requireCourseAdmin from "../../middlewares/requireCourseAdmin.middleware.js";

const assignmentRouter = express.Router();

// Create
assignmentRouter.post("/create", requireAuth, upload.single('assignmentFile'), requireCourseAdmin, assignmentController.createAssignment);

// Get all
// assignmentRouter.get("/", getAssignments);

// // Get by ID
// assignmentRouter.get("/:id", getAssignmentById);

// // Update
// assignmentRouter.put("/:id", updateAssignment);

// // Delete
// assignmentRouter.delete("/:id", deleteAssignment);

// // Get by course
// assignmentRouter.get("/course/:courseId", getAssignmentsByCourse);

export default assignmentRouter;
