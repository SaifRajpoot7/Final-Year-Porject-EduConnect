import express from "express";
const router = express.Router();

import {
  submitAssignment,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  getSubmissionByAssignmentAndStudent,
  gradeSubmission,
  resubmitAssignment,
  deleteSubmission,
} from "../controllers/submissionController.js";

// Submit assignment
assignmentSubmission.post("/", submitAssignment);

// Get all submissions for an assignment
assignmentSubmission.get("/assignment/:assignmentId", getSubmissionsByAssignment);

// Get all submissions by a student
assignmentSubmission.get("/student/:studentId", getSubmissionsByStudent);

// Get a student's submission for a specific assignment
assignmentSubmission.get(
  "/assignment/:assignmentId/student/:studentId",
  getSubmissionByAssignmentAndStudent
);

// Grade a submission
assignmentSubmission.put("/grade/:id", gradeSubmission);

// Resubmit assignment
assignmentSubmission.put("/resubmit/:id", resubmitAssignment);

// Delete submission
assignmentSubmission.delete("/:id", deleteSubmission);

export default assignmentSubmission;
