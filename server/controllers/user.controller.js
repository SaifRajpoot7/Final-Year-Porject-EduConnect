import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import hashPasswordUtils from '../utils/hashPassword.js';
import mailSender from '../utils/mailSender.js';
import { accountConfirmationWelcomeEmailTemplate, accountVerificationEmailTemplate, } from '../utils/emailTemplates.js';
import DailyStat from '../models/dailyActiveUserStat.model.js';
import Appeal from '../models/appeal.model.js';


const trackDailyActiveUser = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "2026-01-04"

    // This single command does everything:
    // 1. Finds the document for 'today'.
    // 2. If not found, creates it (upsert: true).
    // 3. Adds userId to 'loginIds' ONLY if it doesn't exist ($addToSet).
    // 4. We calculate 'activeUsers' count later by just measuring the array length.

    await DailyStat.updateOne(
      { date: today },
      { $addToSet: { loginIds: userId } },
      { upsert: true }
    );

    // Note: We are NOT using a separate 'activeUsers' number field here to avoid 
    // sync issues. We will just count the array length when we display the chart.

  } catch (error) {
    console.log("Error tracking DAU:", error.message);
    // We catch the error here so it doesn't crash the main app flow
  }
};


const registerUser = async (req, res) => {
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    return res.json({ success: false, message: 'All Fields Require' });
  }
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await hashPasswordUtils.generateHashPassword(password);
    // Verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const otpTimeOut = Date.now() + 30 * 60 * 1000
    // Create new user
    const user = new User({
      email,
      fullName,
      password: hashedPassword,
      verificationOtp: otp,
      verificationOtpTimeOut: otpTimeOut,
    });
    // Save user to the database
    await user.save();
    // Exclude password from the response
    user.password = undefined;
    // Sendig Verfication OTP Mail

    const today = new Date().toISOString().split('T')[0];

    DailyStat.updateOne(
      { date: today },
      { $inc: { newUsers: 1 } },
      { upsert: true }
    ).catch(err => console.error("Stats Error:", err));

    // JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Set Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    // Send account veriication otp email
    const mailDetails = {
      email: user.email,
      subject: "Verify Your EduConnect Account",
      body: accountVerificationEmailTemplate({
        name: user.fullName,
        otp: otp,
        url: `${process.env.CLIENT_URL}/verify-account`,
      }),
    };

    mailSender(mailDetails)

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  }
  catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All Fields Require' });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect' });
    }
    // Verify password
    const isPasswordValid = await hashPasswordUtils.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect' });
    }
    // Exclude password from the response
    user.password = undefined;
    // JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Set Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      success: true,
      message: 'User SignedIn successfully',
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });

  }
}

// Super Admin Login
const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All Fields Required' });
  }

  try {
    // 1. Find user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');

    // 2. Basic Check: Does user exist?
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. SECURITY CHECK: Is this user actually a Super Admin?
    // If a regular student tries to login here, we block them immediately.
    if (user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have administrative privileges.'
      });
    }

    // 4. Verify Password
    const isPasswordValid = await hashPasswordUtils.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 5. Exclude password from response
    user.password = undefined;

    // 6. Generate Token
    // It is good practice to include the role in the token payload for admins
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Admin sessions are usually shorter (e.g., 1 day) for security
    );

    // 7. Set Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 Day
    });

    return res.status(200).json({
      success: true,
      message: 'Welcome back, Super Admin',
      user: user // Frontend can now redirect to /admin/dashboard
    });

  } catch (error) {
    console.error('Error logging in super admin:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const userLogout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user found in request' });
    }
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const userProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user found in request' });
    }
    const userObject = req.user.toObject ? req.user.toObject() : req.user;
    const { verificationOtp, verificationOtpTimeOut, resetToken, resetTokenTimeOut, ...safeUser } = userObject;
    trackDailyActiveUser(req.user._id);
    res.status(200).json({
      success: true,
      userData: safeUser,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const generateVerificationOtp = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Must be Logged in to get OTP' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    // Verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    user.verificationOtp = otp;
    user.verificationOtpTimeOut = Date.now() + 30 * 60 * 1000;
    await user.save();
    const mailDetails = {
      email: user.email,
      subject: "Verify Your EduConnect Account",
      body: accountVerificationEmailTemplate({
        name: user.fullName,
        otp: otp,
        url: `${process.env.CLIENT_URL}/verify-account`,
      }),
    };

    mailSender(mailDetails)
    res.status(200).json({ success: true, message: 'OTP Sent Successfully' });
  } catch (error) {
    console.error('Error generating Verification OTP:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

const verifyAccount = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Must be Logged in to verify Account' });
  }
  if (!otp) {
    return res.status(400).json({ success: false, message: 'OTP is required' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.verificationOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (Date.now() > user.verificationOtpTimeOut) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    user.isVerified = true;
    user.verificationOtp = '';
    user.verificationOtpTimeOut = 0;
    await user.save();
    // Send account confirmation and welcome email
    const mailDetails = {
      email: user.email,
      subject: "Welcome to EduConnect | A Virtual Learning Platform",
      body: accountConfirmationWelcomeEmailTemplate({
        name: user.fullName,
        url: `${process.env.CLIENT_URL}/verify-account`,
      }),
    };

    mailSender(mailDetails)

    return res.status(200).json({ success: true, message: 'User verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

const checkAuth = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User is authenticated',
  });
}

// 1. Submit a new Appeal
export const createAccountActivationAppeal = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  try {
    // Validation
    if (!message) {
      return res.status(400).json({ success: false, message: "Please provide a reason for your appeal." });
    }

    const user = await User.findById(userId);
    
    // Only allow appeals if user is actually suspended/blocked
    if (user.status === 'active') {
      return res.status(400).json({ success: false, message: "Your account is active. You cannot submit an appeal." });
    }

    // Check if there is already a PENDING appeal
    const existingAppeal = await Appeal.findOne({ userId, status: 'pending' });
    if (existingAppeal) {
      return res.status(400).json({ success: false, message: "You already have a pending appeal under review." });
    }

    // Create Appeal
    const newAppeal = new Appeal({
      userId,
      message,
      status: 'pending'
    });

    await newAppeal.save();

    res.status(201).json({ success: true, message: "Appeal submitted successfully. We will review it shortly." });

  } catch (error) {
    console.error("Create Appeal Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get User's Latest Appeal Status (For the blocked page UI)
export const getMyAccountActivationAppeal = async (req, res) => {
  try {
    // Get the most recent appeal
    const appeal = await Appeal.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, appeal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const userController = {
  registerUser,
  userLogin,
  superAdminLogin,
  userLogout,
  userProfile,
  generateVerificationOtp,
  verifyAccount,
  checkAuth,
  createAccountActivationAppeal,
  getMyAccountActivationAppeal
};

export default userController;