import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDb from './config/database.js';
import userRouter from './routes/user.routes.js';
import courseRouter from './routes/course.routes.js';
import mailSender from './utils/mailSender.js';
import assignmentRouter from './routes/assignment/assignment.route.js';
import quizRouter from './routes/quiz.routes.js';
import announcementRouter from './routes/announcement.routes.js';
import lectureRouter from "./routes/lecture.routes.js"
import { generateToken } from './controllers/generateStreamToken.controller.js';
import requireAuth from './middlewares/requireAuth.middleware.js';
import nodeCron from 'node-cron';
import lectureController from './controllers/lecture.controller.js';
import superAdminRouter from './routes/superAdmin.routes.js';


const app = express();

connectToDb();

const allowedOrigins = process.env.CLIENT_URL

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Schedule: Run every 10 minutes
nodeCron.schedule('*/10 * * * *', () => {
  lectureController.markMissedLectures();
});


app.use('/api/user', userRouter);
app.use('/api/super-admin', superAdminRouter);
app.use('/api/course', courseRouter);
app.use('/api/assignment',assignmentRouter);
app.use('/api/quiz',quizRouter);
app.use('/api/announcement',announcementRouter);
app.use("/api/lectures", lectureRouter);
app.use("/api/generate-stream-token", requireAuth, generateToken);



app.get('/', (req, res) => {
    res.send('Hello World');
});


export default app;