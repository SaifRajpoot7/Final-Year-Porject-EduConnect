import Course from "../../models/course.model.js";
import DailyStat from "../../models/dailyActiveUserStat.model.js";
import User from "../../models/user.model.js";
import Lecture from "../../models/lecture.model.js";
import Appeal from '../../models/appeal.model.js';


const getChartData = async (req, res) => {
  try {
    const stats = await DailyStat.find()
      .sort({ date: -1 })
      .limit(30);

    const chartData = stats.reverse().map(doc => ({
      date: doc.date,
      registrations: doc.newUsers,
      activeUsers: doc.loginIds.length // <--- Calculate count here
    }));

    res.status(200).json({ success: true, chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOverviewCardsData = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    // Execute all queries in parallel for better performance
    const [totalUsers, totalCourses, totalLiveLectures, dailyStats] = await Promise.all([

      // 1. Total number of users
      User.countDocuments(),

      // 2. Total courses
      Course.countDocuments(),

      // 3. Total live lectures
      Lecture.countDocuments({ status: 'live' }),

      // 4. Users with suspended OR blocked status
      // We use $in operator to check multiple values efficiently
      DailyStat.findOne({ date: today })
    ]);

    const activeUsersToday = dailyStats ? dailyStats.loginIds.length : 0;
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalLiveLectures,
        activeUsersToday
      }
    });

  } catch (error) {
    console.error("Error fetching overview data:", error); // Good practice to log server-side
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch users where role is NOT 'super_admin'
    // 2. Exclude the password field (-password)
    // 3. Sort by newest first (optional but recommended for dashboards)
    const users = await User.find({ role: { $ne: 'super_admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
      count: users.length // Helpful for the frontend to show "Total: 50"
    });

  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const changeUserStatus = async (req, res) => {
  // Add 'reason' to the request body
  const { userId, action, reason } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Validate that a reason is provided for suspensions
    if ((action === 'suspend' || action === 'block') && !reason) {
      return res.status(400).json({ success: false, message: "A reason is required for this action." });
    }

    if (action === 'suspend') {
      user.suspensionCount += 1;

      user.statusMessage = reason;

      if (user.suspensionCount >= 5) {
        user.status = 'blocked';
        user.blockedAt = new Date();
        await user.save();

        return res.status(200).json({ success: true, message: `User blocked (${user.suspensionCount}th strike).` });

      } else {
        user.status = 'suspended';
        await user.save();

      

        return res.status(200).json({ success: true, message: "User suspended and reason logged." });
      }
    }

    // ... Handle Activate logic similarly (Clear statusMessage on activate)
    else if (action === 'activate') {

      // 1. Check the 7-Day Rule if they were blocked
      if (user.status === 'blocked') {
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
        const timePassed = Date.now() - new Date(user.blockedAt).getTime();

        if (timePassed < sevenDaysInMillis) {
          const daysRemaining = Math.ceil((sevenDaysInMillis - timePassed) / (24 * 60 * 60 * 1000));
          return res.status(403).json({
            success: false,
            message: `Cooling period active. Cannot unblock for ${daysRemaining} more days.`
          });
        }

        // If 7 days passed, reset stats
        user.suspensionCount = 0;
        user.blockedAt = null;
      }

      // 2. Apply Activation
      user.status = 'active';
      user.statusMessage = null;
      await user.save();

      return res.status(200).json({ success: true, message: "User activated." });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getAllAppeals = async (req, res) => {
  try {

    const appeals = await Appeal.find({ status: { $in: ['pending', 'rejected'] } })
      .populate('userId', 'fullName email status suspensionCount') // Get user details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, appeals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveAppeal = async (req, res) => {
  const { appealId, action } = req.body; // action: 'approve' | 'reject'
  const adminId = req.user._id;

  try {
    const appeal = await Appeal.findById(appealId).populate('userId');
    if (!appeal) {
      return res.status(404).json({ success: false, message: "Appeal not found." });
    }

    if (appeal.status !== 'pending') {
      return res.status(400).json({ success: false, message: "This appeal has already been resolved." });
    }

    const user = await User.findById(appeal.userId._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User associated with this appeal not found." });
    }

    // --- REJECT LOGIC ---
    if (action === 'reject') {
      appeal.status = 'rejected';
      // Optional: You could save an admin note to the appeal model if you added that field
      // appeal.adminNote = adminResponse; 
      await appeal.save();

      return res.status(200).json({ success: true, message: "Appeal rejected." });
    }

    // --- APPROVE LOGIC (The Heavy Lifting) ---
    if (action === 'approve') {

      // 1. Update Appeal
      appeal.status = 'approved';
      await appeal.save();

      // 2. Unblock/Unsuspend the User
      // Note: Approval implies a "Pardon", so we reset their strikes and ignore the 7-day timer.
      user.status = 'active';
      user.statusMessage = null; // Clear the "Why am I blocked" message
      user.blockedAt = null;     // Clear block timer
      await user.save();


      return res.status(200).json({ success: true, message: "Appeal approved. User account has been reactivated." });
    }

    return res.status(400).json({ success: false, message: "Invalid action." });

  } catch (error) {
    console.error("Resolve Appeal Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const superAdminController = {
  getChartData,
  getOverviewCardsData,
  getAllUsers,
  getAllAppeals,
  changeUserStatus,
  resolveAppeal,
}

export default superAdminController