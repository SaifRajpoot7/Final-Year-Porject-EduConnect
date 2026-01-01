import express from 'express';
import requireAuth from "../middlewares/requireAuth.middleware.js";
import quizController from "../controllers/quiz.controller.js";
import requireCourseAdmin from "../middlewares/requireCourseAdmin.middleware.js";
import courseRole from '../middlewares/courseRole.middleware.js';

const quizRouter = express.Router();

quizRouter.post('/create', requireAuth, requireCourseAdmin, quizController.createQuiz);

quizRouter.get("/all", requireAuth, quizController.getAllQuizByUser);

quizRouter.get("/all/course", requireAuth, courseRole, quizController.getAllCourseQuiz);

quizRouter.post("/submit/:quizId", requireAuth, courseRole, quizController.submitQuiz);

quizRouter.get("/all/:quizId", requireAuth, requireCourseAdmin, quizController.allSubmissionOfQuiz);
export default quizRouter