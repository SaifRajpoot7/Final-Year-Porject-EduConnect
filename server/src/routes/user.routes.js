import express from 'express';
const userRouter = express.Router();
import userController from '../controllers/user.controller.js';
import requireAuth from '../middlewares/requireAuth.middleware.js';

// Public routes
userRouter.post('/signup', userController.registerUser);
userRouter.post('/signin', userController.userLogin);

// Protected routes
userRouter.post('/verifyaccount', requireAuth, userController.verifyAccount);
userRouter.get('/logout', requireAuth, userController.userLogout);
userRouter.get('/profile', requireAuth, userController.userProfile);
userRouter.get('/is-auth', requireAuth, userController.checkAuth);
userRouter.post('/generateotp', requireAuth, userController.generateVerificationOtp);

export default userRouter;