import express from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import requireCourseAdmin from "../middlewares/requireCourseAdmin.middleware.js";
import announcementController from "../controllers/announcement.controller.js";
import courseRole from "../middlewares/courseRole.middleware.js";

const announcementRouter = express.Router();


announcementRouter.get("/all", requireAuth, courseRole, announcementController.getAnnouncements);

announcementRouter.post("/create", requireAuth, requireCourseAdmin, upload.single('attachment'), announcementController.createAnnouncement);

export default announcementRouter;
