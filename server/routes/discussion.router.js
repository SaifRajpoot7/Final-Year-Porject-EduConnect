import express from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import courseRole from "../middlewares/courseRole.middleware.js"; // Ensures req.isCourseMember is set
import discussionController from "../controllers/discussion.controller.js";

const discussionRouter = express.Router();

// Get all messages
discussionRouter.get("/all", requireAuth, courseRole, discussionController.getCourseMessages);

// Send a message (Any course member can do this)
discussionRouter.post(
    "/send", 
    requireAuth, 
    courseRole, 
    upload.single('attachment'), 
    discussionController.sendMessage
);

export default discussionRouter;