import express from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import feedbackController from "../controllers/feedback.controller.js";
import requireSuperAdmin from "../middlewares/requireSuperAdmin.middleware.js";

const feedbackRouter = express.Router();

// Create
feedbackRouter.post("/submit", requireAuth, upload.single('feedbackImage'), feedbackController.submitFeedback);
feedbackRouter.get("/get-all", requireAuth, requireSuperAdmin, feedbackController.getAllFeedbacks);


export default feedbackRouter;
