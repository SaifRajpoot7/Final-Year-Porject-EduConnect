import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDb from './config/database.js';
import userRouter from './routes/user.routes.js';
import mailSender from './utils/mailSender.js';


const app = express();

connectToDb();

const allowedOrigins = process.env.CLIENT_URL

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Temporary test route
app.get("/test-email", async (req, res) => {
    try {
        await mailSender({
            email: "saiflaptop1@gmail.com",
            subject: "Welcome to Abdul Luxury Travel SL",
            body: welcomeEmailTemplate,
            name: "Saif",
            url: "book-ride",
        });
        res.send("✅ Test email sent!");
    } catch (error) {
        res.status(500).send("❌ Email failed: " + error.message);
    }
});


app.use('/api/user', userRouter);
// app.use('/api/booking', bookingRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});


export default app;