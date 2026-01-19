import Lecture from "../models/lecture.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";
import { StreamChat } from "stream-chat";
import User from "../models/user.model.js";
import { StreamClient } from "@stream-io/node-sdk";

// Initialize Stream Client
const serverClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET,
  { timeout: 10000 }
);

const streamVideoClient = new StreamClient(
    process.env.STREAM_API_KEY,
    zh2b9ra6g5abtfu8nxp8rwccbnjv5w5h6y3tbyc2qzhrym66jb4w38ngqc8ubw8h
);

const scheduleLecture = async (req, res) => {
  try {
    const { courseId, title, scheduledStart, scheduledEnd } = req.body;

    if (!courseId || !title || !scheduledStart || !scheduledEnd) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (new Date(scheduledStart) >= new Date(scheduledEnd)) {
      return res.status(400).json({ success: false, message: "End time must be after start time" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only course teacher can schedule lectures" });
    }

    const lecture = await Lecture.create({
      course: courseId,
      teacher: req.user._id,
      title,
      scheduledStart,
      scheduledEnd,
      attendance: []
    });

    res.status(201).json({ success: true, lecture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * JOIN LECTURE
 */
const joinLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const lecture = await Lecture.findById(lectureId).populate("course");
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

    const isTeacher = lecture.teacher.toString() === userId.toString();

    // ... (Enrollment and Status checks remain the same) ...
    // ... Copy your existing enrollment/status logic here ... 

    // 1. Enrollment Check
    if (!isTeacher) {
      const isEnrolled = lecture.course.students.some(
        studentId => studentId.toString() === req.user.email.toString() || studentId.toString() === userId.toString()
      );
      if (!isEnrolled) {
        return res.status(403).json({ success: false, message: "You are not enrolled in this course." });
      }
    }

    // 2. Status Checks
    if (lecture.status === "ended") {
      return res.status(403).json({ success: false, message: "Lecture has ended." });
    }
    if (!isTeacher && lecture.status !== "live") {
      return res.status(403).json({ success: false, message: "Waiting for host to start the lecture." });
    }

    const now = new Date();
    

    // 3. Teacher Start Logic
    if (isTeacher && lecture.status === "upcoming") {
      lecture.status = "live";
      lecture.startsAt = now;
    }

    // 4. Attendance & Single Device Logic
    let attendanceRecord = lecture.attendance.find(
      r => r.student && r.student.toString() === userId.toString()
    );

    if (attendanceRecord) {
      // --- FIX: Add Timeout Logic ---
      // If lastJoinedAt exists, check how long ago it was.
      // If it was less than 2 minutes ago, we block them (assuming they are actually online).
      // If it was > 2 minutes ago, we assume they crashed and let them back in.

      const TIMEOUT_THRESHOLD = 2 * 60 * 1000; // 2 minutes
      const lastSeen = attendanceRecord.lastJoinedAt ? new Date(attendanceRecord.lastJoinedAt).getTime() : 0;
      const timeDiff = now.getTime() - lastSeen;

      const isSessionActive = attendanceRecord.lastJoinedAt && timeDiff < TIMEOUT_THRESHOLD;

      if (isSessionActive && !isTeacher) {
        return res.status(409).json({ success: false, message: "You are already joined from another device/tab." });
      }

      // REJOIN: Update existing doc
      attendanceRecord.lastJoinedAt = now;
    } else {
      // NEW JOIN
      lecture.attendance.push({
        student: userId,
        lastJoinedAt: now,
        totalJoinedMs: 0,
        present: false
      });
    }

    await lecture.save();
    res.json({ success: true, lecture, status: lecture.status });

  } catch (error) {
    console.error("Join Lecture Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * LEAVE LECTURE
 */
const leaveLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.user._id;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

    // FIX: Ensure we check if r.student exists before toString()
    const attendanceRecord = lecture.attendance.find(
      r => r.student && r.student.toString() === userId.toString()
    );

    if (attendanceRecord && attendanceRecord.lastJoinedAt) {
      const now = Date.now();
      const sessionDuration = now - new Date(attendanceRecord.lastJoinedAt).getTime();

      attendanceRecord.totalJoinedMs = (attendanceRecord.totalJoinedMs || 0) + sessionDuration;
      attendanceRecord.lastJoinedAt = null; // Mark as offline

      await lecture.save();
    }

    res.json({ success: true, message: "Logged out of lecture" });
  } catch (error) {
    console.error("Leave Lecture Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * END LECTURE (Admin Only)
 */
const endLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.user._id;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

    if (lecture.teacher.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Only teacher can end lecture" });
    }
    const course = await Course.findById(lecture.course);

    const students = course.students
    // 1. End Stream Call
    try {
      const call = serverClient.call("default", lecture._id.toString());
      await call.end();
    } catch (err) {
      console.error("Stream End Error (Ignored):", err.message);
    }

    // 2. Finalize Attendance
    const now = new Date();
    // Use scheduled duration for calculation or Actual Start time
    const start = lecture.startsAt ? new Date(lecture.startsAt).getTime() : new Date(lecture.scheduledStart).getTime();
    const end = now.getTime(); // Use current time as end time
    const lectureDurationMs = end - start;

    const validDuration = lectureDurationMs > 0 ? lectureDurationMs : 3600000; // fallback 1hr
    const thresholdMs = validDuration * 0.5; // 50% rule

    lecture.attendance.forEach(record => {
      // If user is still "online", close their session
      if (record.lastJoinedAt) {
        const currentSession = now.getTime() - new Date(record.lastJoinedAt).getTime();
        record.totalJoinedMs = (record.totalJoinedMs || 0) + currentSession;
        record.lastJoinedAt = null;
      }

      // Apply 50% Logic
      if (record.totalJoinedMs >= thresholdMs) {
        record.present = true;
      } else {
        record.present = false;
      }
    });

    lecture.status = "ended";
    lecture.endedAt = now;
    await lecture.save();
    await initializeStudentAttendance(lectureId, students);

    res.json({ success: true, message: "Lecture ended and attendance finalized", lecture });

  } catch (error) {
    console.error("End Lecture Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Manually Finalize Attendance (Optional, if you want to call it separately)
const finalizeAttendance = async (req, res) => {
  // Re-using the logic from endLecture for modularity
  return endLecture(req, res);
};

const getLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const lecture = await Lecture.findById(lectureId).populate("course");
    if (!lecture) return res.status(404).json({ success: false, message: "Not found" });

    const isAdmin = lecture.teacher.toString() === req.user._id.toString();

    res.status(200).json({
      success: true,
      lecture,
      isAdmin,
      lectureState: lecture.status
    });
  } catch (err) {
    console.error("Get Lecture Error:", err);
    res.status(500).json({ success: false });
  }
};

const getLectureAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    // Populate student details inside the attendance array
    const lecture = await Lecture.findById(lectureId)
      .populate({
        path: "attendance.student", // Path to the field inside the array
        select: "fullName email"    // Fields you want to retrieve
      });

    if (!lecture) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({
      success: true,
      lecture,
    });
  } catch (err) {
    console.error("Get Lecture Error:", err);
    res.status(500).json({ success: false });
  }
};

const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const isTeacher = course.teacher.toString() === req.user._id.toString();
    const isStudent = course.students.some(id => id.toString() === req.user._id.toString());

    if (!isTeacher && !isStudent) {
      const isStudentEmail = course.students.some(email => email === req.user.email);
      if (!isStudentEmail) {
        return res.status(403).json({ success: false, message: "Not enrolled" });
      }
    }

    const lectures = await Lecture.find({ course: courseId }).sort({ scheduledStart: -1 });

    res.json({
      success: true,
      lectures,
      isCourseAdmin: isTeacher
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLecturesByUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    const userEmail = req.user?.email;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const lecturesFromMyCreation = await Lecture.find({
      teacher: userId,
      status: { $in: ["upcoming", "live"] },
    }).populate({ path: "course", select: "title" }).sort({ scheduledStart: -1 });

    const enrolledCourses = await Course.find(
      { students: userEmail },
      { _id: 1 }
    );
    const enrolledCourseIds = enrolledCourses.map(c => c._id);

    const lecturesFromEnrollment = await Lecture.find({
      course: { $in: enrolledCourseIds },
      status: { $in: ["upcoming", "live"] },
    }).populate({ path: "course", select: "title" }).sort({ scheduledStart: -1 });

    return res.status(200).json({
      success: true,
      lecturesFromMyCreation,
      lecturesFromEnrollment
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markMissedLectures = async () => {
  try {
    const now = new Date();

    // Find all lectures that are still 'upcoming' but their end time has passed
    const result = await Lecture.updateMany(
      {
        status: 'upcoming',
        scheduledEnd: { $lt: now } // scheduledEnd is less than current time
      },
      {
        $set: { status: 'missed' }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Cron Job: Marked ${result.modifiedCount} lectures as 'missed'.`);
    }
    // Optional: else console.log("Cron Job: No missed lectures found.");

  } catch (error) {
    console.error("Error in markMissedLectures cron job:", error);
  }
};


const initializeStudentAttendance = async (lectureId, studentEmails) => {
  try {
    // 1. Get user IDs for all emails provided
    // We use $in to find all users whose email is in the array
    console.log(lectureId)
    console.log(studentEmails)
    const students = await User.find({
      email: { $in: studentEmails }
    }).select("_id");

    if (students.length === 0) {
      console.log("No users found for the provided emails.");
      return;
    }

    // 2. Fetch the Lecture document
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      throw new Error("Lecture not found");
    }

    // 3. Check and Add missing records
    // We create a Set of existing student IDs (as strings) for efficient checking
    // This avoids O(N^2) complexity if the attendance list is large
    const existingStudentIds = new Set(
      lecture.attendance.map((record) => record.student.toString())
    );

    let isModified = false;

    // Iterate through the fetched users from Step 1
    for (const student of students) {
      const studentIdString = student._id.toString();

      // If the student is NOT in the existing set, add them
      if (!existingStudentIds.has(studentIdString)) {
        lecture.attendance.push({
          student: student._id,
          present: false,       // Explicitly setting as requested
          totalJoinedMs: 0,     // Default
          lastJoinedAt: null    // Default
        });

        isModified = true;
      }
    }

    // 4. Save only if changes were made
    if (isModified) {
      await lecture.save();
      console.log("Attendance records updated successfully.");
    } else {
      console.log("All students already exist in the attendance list.");
    }

    return lecture;

  } catch (error) {
    console.error("Error initializing attendance:", error);
    throw error;
  }
};

const getLectureRecordings = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // 1. Basic Validation
    if (!lectureId) {
      return res.status(400).json({ success: false, message: "Lecture ID required" });
    }

    // 2. Query GetStream for recordings using the Video SDK
    // The call type must match what you used to create the call (usually 'default')
    const call = streamVideoClient.video.call("default", lectureId);
    
    // 3. Fetch list
    const { recordings } = await call.listRecordings();

    return res.status(200).json({
      success: true,
      recordings
    });

  } catch (error) {
    console.error("Get Recordings Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch recordings",
      error: error.message 
    });
  }
};


const lectureController = {
  scheduleLecture,
  joinLecture,
  leaveLecture,
  endLecture,
  getLecture,
  getCourseLectures,
  getAllLecturesByUser,
  finalizeAttendance,
  markMissedLectures,
  getLectureAttendance,
  getLectureRecordings
};

export default lectureController;