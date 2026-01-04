// // // import Lecture from "../models/lecture.model.js";
// // // import Course from "../models/course.model.js";
// // // import mongoose from "mongoose";
// // // import { StreamChat } from "stream-chat"; // old package
// // // // OR
// // // // import { StreamChatServer } from "@stream-io/node-sdk"; // depending on SDK version

// // // const serverClient = new StreamChat(
// // //   process.env.STREAM_API_KEY,
// // //   process.env.STREAM_API_SECRET
// // // );

// // // /**
// // //  * TEACHER: Schedule a lecture
// // //  */
// // // const scheduleLecture = async (req, res) => {
// // //   try {
// // //     const { courseId, title, scheduledStart, scheduledEnd } = req.body;

// // //     if (!courseId || !title || !scheduledStart || !scheduledEnd) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "All fields are required"
// // //       });
// // //     }

// // //     if (new Date(scheduledStart) >= new Date(scheduledEnd)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "End time must be after start time"
// // //       });
// // //     }

// // //     const course = await Course.findById(courseId);
// // //     if (!course) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Course not found"
// // //       });
// // //     }

// // //     if (course.teacher.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({
// // //         success: false,
// // //         message: "Only course teacher can schedule lectures"
// // //       });
// // //     }

// // //     const lecture = await Lecture.create({
// // //       course: courseId,
// // //       teacher: req.user._id,
// // //       title,
// // //       scheduledStart,
// // //       scheduledEnd
// // //     });

// // //     res.status(201).json({
// // //       success: true,
// // //       lecture
// // //     });

// // //   } catch (error) {
// // //     res.status(500).json({
// // //       success: false,
// // //       message: error.message
// // //     });
// // //   }
// // // };

// // // /**
// // //  * STUDENT / TEACHER: Get lectures of a course
// // //  */
// // // const getCourseLectures = async (req, res) => {
// // //   try {
// // //     const { courseId } = req.params;
// // //     // const isCourseAdmin = req.isCourseAdmin;

// // //     const course = await Course.findById(courseId);
// // //     if (!course) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Course not found"
// // //       });
// // //     }

// // //     const isTeacher =
// // //       course.teacher.toString() === req.user._id.toString();

// // //     const isStudent =
// // //       course.students.some(
// // //         id => id.toString() === req.user.email.toString()
// // //       );

// // //     if (!isTeacher && !isStudent) {
// // //       return res.status(403).json({
// // //         success: false,
// // //         message: "You are not enrolled in this course"
// // //       });
// // //     }

// // //     const lectures = await Lecture.find({ course: courseId })
// // //       .sort({ createdAt: -1 });

// // //     res.json({
// // //       success: true,
// // //       lectures,
// // //       isCourseAdmin: req.isCourseAdmin
// // //     });

// // //   } catch (error) {
// // //     res.status(500).json({
// // //       success: false,
// // //       message: error.message
// // //     });
// // //   }
// // // };

// // // /**
// // //  * STUDENT / TEACHER: Join lecture (TIME-GATED, TEACHER-CONTROLLED)
// // //  */
// // // // const joinLecture = async (req, res) => {
// // // //   try {
// // // //     const { lectureId } = req.params;
// // // //     const userId = req.user._id;
// // // //     const userEmail = req.user.email;

// // // //     const lecture = await Lecture.findById(lectureId).populate("course");

// // // //     const isTeacher = lecture.teacher.toString() === userId.toString();

// // // //     // if (!lecture) {
// // // //     //   return res.status(404).json({
// // // //     //     success: false,
// // // //     //     message: "Lecture not found"
// // // //     //   });
// // // //     // }

// // // //     // if (lecture.status === "ended") {
// // // //     //   return res.status(403).json({
// // // //     //     success: false,
// // // //     //     message: "Lecture has already ended"
// // // //     //   });
// // // //     // }



// // // //     // if (!isTeacher) {
// // // //     //   return res.status(403).json({
// // // //     //     success: false,
// // // //     //     message: "You are not teacher of this Lecture/Course"
// // // //     //   });
// // // //     // }

// // // //     // const now = new Date();

// // // //     // if (now < lecture.scheduledStart) {
// // // //     //   return res.status(403).json({
// // // //     //     success: false,
// // // //     //     message: "Lecture time has not arrived yet"
// // // //     //   });
// // // //     // }

// // // //     // if (now > lecture.scheduledEnd) {
// // // //     //   return res.status(403).json({
// // // //     //     success: false,
// // // //     //     message: "Lecture time is over"
// // // //     //   });
// // // //     // }

// // // //     // // Teacher starts the lecture
// // // //     // if (isTeacher && lecture.status === "upcoming") {
// // // //     //   lecture.status = "live";
// // // //     //   lecture.startsAt = now;
// // // //     //   await lecture.save();
// // // //     // }

// // // //     if (!isTeacher && lecture.status !== "live")
// // // //       return res.status(403).json({ message: "Lecture not started" });

// // // //     const active = lecture.attendance.find(
// // // //       a => a.user.equals(userId) && a.lastJoinedAt
// // // //     );

// // // //     if (active)
// // // //       return res.status(403).json({ message: "Already connected elsewhere" });

// // // //     let record = lecture.attendance.find(a => a.user.equals(userId));
// // // //     if (!record) {
// // // //       lecture.attendance.push({
// // // //         user: userId,
// // // //         lastJoinedAt: new Date()
// // // //       });
// // // //     } else {
// // // //       record.lastJoinedAt = new Date();
// // // //     }

// // // //     if (isTeacher && lecture.status === "upcoming") {
// // // //       lecture.status = "live";
// // // //       lecture.startsAt = new Date();
// // // //     }

// // // //     await lecture.save();


// // // //     res.json({
// // // //       success: true,
// // // //       lecture,
// // // //       status: lecture.status
// // // //     });

// // // //   } catch (error) {
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: error.message
// // // //     });
// // // //   }
// // // // };


// // // const joinLecture = async (req, res) => {
// // //   const { lectureId } = req.params;
// // //   const userId = req.user._id;

// // //   const lecture = await Lecture.findById(lectureId);
// // //   if (!lecture) return res.status(404).json({ success: false });

// // //   if (lecture.status !== "live") {
// // //     return res.status(403).json({
// // //       success: false,
// // //       message: "Lecture not started yet",
// // //     });
// // //   }

// // //   let attendance = await LectureAttendance.findOne({
// // //     lecture: lectureId,
// // //     user: userId,
// // //   });

// // //   if (attendance?.active) {
// // //     return res.status(403).json({
// // //       success: false,
// // //       message: "Already joined from another device/tab",
// // //     });
// // //   }

// // //   const now = new Date();

// // //   if (!attendance) {
// // //     attendance = await LectureAttendance.create({
// // //       lecture: lectureId,
// // //       user: userId,
// // //       firstJoinedAt: now,
// // //       lastJoinedAt: now,
// // //       active: true,
// // //     });
// // //   } else {
// // //     attendance.lastJoinedAt = now;
// // //     attendance.active = true;
// // //     await attendance.save();
// // //   }

// // //   res.json({ success: true });
// // // };


// // // /**
// // //  * TEACHER / SYSTEM: Finalize attendance for a lecture
// // //  * Marks present if totalJoinedMs >= 50% of lecture duration
// // //  */
// // // const finalizeAttendance = async (req, res) => {
// // //   try {
// // //     const { lectureId } = req.params;

// // //     const lecture = await Lecture.findById(lectureId);

// // //     if (!lecture) {
// // //       return res.status(404).json({ success: false, message: "Lecture not found" });
// // //     }

// // //     // Only teacher can finalize
// // //     if (lecture.teacher.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({ success: false, message: "Unauthorized" });
// // //     }

// // //     // Calculate lecture duration in milliseconds
// // //     const lectureDuration = new Date(lecture.scheduledEnd) - new Date(lecture.scheduledStart);

// // //     lecture.attendance.forEach(record => {
// // //       // Include any ongoing session if student is still connected
// // //       if (record.lastJoinedAt) {
// // //         record.totalJoinedMs += new Date() - new Date(record.lastJoinedAt);
// // //         record.lastJoinedAt = null;
// // //       }

// // //       // Mark present if >= 50%
// // //       record.present = record.totalJoinedMs >= lectureDuration / 2;
// // //     });

// // //     lecture.status = "ended"; // Ensure lecture is ended
// // //     await lecture.save();

// // //     res.json({
// // //       success: true,
// // //       message: "Attendance finalized",
// // //       attendance: lecture.attendance
// // //     });

// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ success: false, message: error.message });
// // //   }
// // // };

// // // const getLecture = async (req, res) => {
// // //   try {
// // //     const { lectureId } = req.params;

// // //     if (!lectureId) {
// // //       return res.status(400).json({ success: false, message: "Lecture ID required" });
// // //     }

// // //     if (!mongoose.Types.ObjectId.isValid(lectureId)) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Invalid lecture id",
// // //         invalidLecture: true
// // //       });
// // //     }

// // //     const lecture = await Lecture.findById(lectureId);
// // //     if (!lecture) {
// // //       return res.status(404).json({ success: false, message: "Lecture not found" });
// // //     }

// // //     const course = await Course.findById(lecture.course);
// // //     if (!course) {
// // //       return res.status(404).json({ success: false, message: "Course not found" });
// // //     }

// // //     const isAdmin = lecture.teacher.toString() === req.user._id.toString();
// // //     const isStudent = course.students.some(email => email === req.user.email);
// // //     const isMember = isAdmin || isStudent;
// // //     let isLectureTimeArrived = false

// // //     // ---------------- Lecture state logic ----------------
// // //     let lectureState = ""; // default
// // //     let lectureReadyToStart = false; // default

// // //     const now = Date.now();
// // //     const scheduledStart = new Date(lecture.scheduledStart).getTime();
// // //     if (lecture.status === "ended") {
// // //       lectureState = "ended";
// // //     }
// // //     if (lecture.status === "upcoming" && scheduledStart > now) {
// // //       isLectureTimeArrived = false;
// // //       lectureState = "time_not_arrived"; // lecture scheduled for future
// // //     }
// // //     if (lecture.status === "upcoming" && scheduledStart <= now) {
// // //       isLectureTimeArrived = true;
// // //       lectureState = "not_started_by_admin"; // time passed but admin hasn't started
// // //     }
// // //     // You can add more states here if needed, e.g., cancelled, paused, etc.

// // //     if (lecture.status === "upcoming" && scheduledStart <= now && isAdmin) {
// // //       lectureReadyToStart = true;
// // //     }
// // //     if (lecture.status === "live") {
// // //       lectureState = "live";
// // //     }

// // //     return res.status(200).json({
// // //       success: true,
// // //       lecture,
// // //       isMember,
// // //       isAdmin,
// // //       lectureState,
// // //       isLectureTimeArrived,
// // //       lectureReadyToStart
// // //     });
// // //   } catch (error) {
// // //     console.error(error);
// // //     return res.status(500).json({ success: false, message: "Internal server error" });
// // //   }
// // // };



// // // // const endLecture = async (req, res) => {
// // // //   try {
// // // //     const { lectureId } = req.params;
// // // //     const userId = req.user._id;

// // // //     if (!mongoose.Types.ObjectId.isValid(lectureId)) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Invalid lecture ID"
// // // //       });
// // // //     }

// // // //     const lecture = await Lecture.findById(lectureId);
// // // //     if (!lecture) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Lecture not found"
// // // //       });
// // // //     }

// // // //     // Teacher-only
// // // //     if (lecture.teacher.toString() !== userId.toString()) {
// // // //       return res.status(403).json({
// // // //         success: false,
// // // //         message: "Only teacher can end the lecture"
// // // //       });
// // // //     }

// // // //     if (lecture.status === "ended") {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Lecture already ended"
// // // //       });
// // // //     }

// // // //     // End Stream call ONLY if lecture was live
// // // //     if (lecture.status === "live") {
// // // //       try {
// // // //         const call = serverClient.call("default", lecture._id.toString());
// // // //         await call.end();
// // // //       } catch (streamError) {
// // // //         // Log but DO NOT block lecture ending
// // // //         console.error("Stream end call failed:", streamError.message);
// // // //       }
// // // //     }

// // // //     // Update lecture state
// // // //     lecture.status = "ended";
// // // //     lecture.endedAt = new Date();


// // // //     const duration =
// // // //       new Date() - new Date(lecture.startsAt);

// // // //     lecture.attendance.forEach(r => {
// // // //       if (r.lastJoinedAt) {
// // // //         r.totalJoinedMs += Date.now() - r.lastJoinedAt;
// // // //         r.lastJoinedAt = null;
// // // //       }
// // // //       r.present = r.totalJoinedMs >= duration / 2;
// // // //     });

// // // //     lecture.status = "ended";
// // // //     lecture.endedAt = new Date();

// // // //     await serverClient.call("default", lecture._id.toString()).end();
// // // //     await lecture.save();



// // // //     // await lecture.save();

// // // //     return res.status(200).json({
// // // //       success: true,
// // // //       message: "Lecture ended successfully",
// // // //       lecture: {
// // // //         _id: lecture._id,
// // // //         status: lecture.status,
// // // //         endedAt: lecture.endedAt
// // // //       }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     return res.status(500).json({
// // // //       success: false,
// // // //       message: "Internal server error"
// // // //     });
// // // //   }
// // // // };


// // // const endLecture = async (req, res) => {
// // //   const lecture = await Lecture.findById(req.params.lectureId);
// // //   if (!lecture) return res.status(404).json({ success: false });

// // //   if (lecture.teacher.toString() !== req.user._id.toString()) {
// // //     return res.status(403).json({ success: false });
// // //   }

// // //   lecture.status = "ended";
// // //   lecture.endedAt = new Date();
// // //   await lecture.save();

// // //   const duration =
// // //     new Date(lecture.scheduledEnd) -
// // //     new Date(lecture.scheduledStart);

// // //   const records = await LectureAttendance.find({
// // //     lecture: lecture._id,
// // //   });

// // //   for (const r of records) {
// // //     if (r.active && r.lastJoinedAt) {
// // //       r.totalJoinedMs += new Date() - r.lastJoinedAt;
// // //       r.active = false;
// // //     }

// // //     r.present = r.totalJoinedMs >= duration / 2;
// // //     await r.save();
// // //   }

// // //   // END STREAM CALL
// // //   await serverClient.call("default", lecture._id.toString()).end();

// // //   res.json({ success: true });
// // // };


// // // /**
// // //  * USER: Get all upcoming lectures related to logged-in user
// // //  * - As Teacher (created by user)
// // //  * - As Student (enrolled in course)
// // //  */
// // // const getAllLecturesByUser = async (req, res) => {
// // //   try {
// // //     const userId = req.user?._id;
// // //     const userEmail = req.user?.email;

// // //     // Authentication check
// // //     if (!userId) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: "Not authenticated"
// // //       });
// // //     }

// // //     const now = new Date();

// // //     /**
// // //      * 1. Lectures created by the user (Teacher)
// // //      */
// // //     const lecturesFromMyCreation = await Lecture.find({
// // //       teacher: userId,
// // //       status: { $in: ["upcoming", "live"] },
// // //     })
// // //       .populate({
// // //         path: "course",
// // //         select: "title"
// // //       })
// // //       .sort({ createdAt: -1 }); // nearest first

// // //     /**
// // //      * 2. Lectures where user is enrolled as student
// // //      *    - Find courses where user is a student
// // //      *    - Then find upcoming lectures for those courses
// // //      */
// // //     const enrolledCourses = await Course.find(
// // //       { students: userEmail },
// // //       { _id: 1 }
// // //     );

// // //     const enrolledCourseIds = enrolledCourses.map(course => course._id);

// // //     const lecturesFromEnrollment = await Lecture.find({
// // //       course: { $in: enrolledCourseIds },
// // //       status: { $in: ["upcoming", "live"] },
// // //     })
// // //       .populate({
// // //         path: "course",
// // //         select: "title"
// // //       })
// // //       .sort({ createdAt: -1 }); // nearest first

// // //     return res.status(200).json({
// // //       success: true,
// // //       lecturesFromMyCreation,
// // //       lecturesFromEnrollment
// // //     });

// // //   } catch (error) {
// // //     console.error(error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       message: error.message
// // //     });
// // //   }
// // // };


// // // const leaveLecture = async (req, res) => {
// // //   const { lectureId } = req.params;
// // //   const userId = req.user._id;

// // //   const attendance = await LectureAttendance.findOne({
// // //     lecture: lectureId,
// // //     user: userId,
// // //     active: true,
// // //   });

// // //   if (!attendance) return res.json({ success: true });

// // //   const now = new Date();
// // //   const sessionTime = now - attendance.lastJoinedAt;

// // //   attendance.totalJoinedMs += sessionTime;
// // //   attendance.lastJoinedAt = null;
// // //   attendance.active = false;

// // //   await attendance.save();

// // //   res.json({ success: true });
// // // };



// // // export default {
// // //   scheduleLecture,
// // //   getCourseLectures,
// // //   joinLecture,
// // //   endLecture,
// // //   finalizeAttendance,
// // //   getLecture,
// // //   getAllLecturesByUser,
// // //   leaveLecture,
// // // };


// // import Lecture from "../models/lecture.model.js";
// // import Course from "../models/course.model.js";
// // import mongoose from "mongoose";
// // import { StreamChat } from "stream-chat";

// // // Initialize Stream Client (Server Side)
// // const serverClient = new StreamChat(
// //   process.env.STREAM_API_KEY,
// //   process.env.STREAM_API_SECRET
// // );

// // /* -------------------------------------------------------------------------- */
// // /* HELPER FUNCTIONS                             */
// // /* -------------------------------------------------------------------------- */

// // // Helper to calculate time for a user who is currently "online" in DB logic
// // const calculateSessionTime = (record) => {
// //   if (record.lastJoinedAt) {
// //     const sessionDuration = Date.now() - new Date(record.lastJoinedAt).getTime();
// //     return (record.totalJoinedMs || 0) + sessionDuration;
// //   }
// //   return record.totalJoinedMs || 0;
// // };

// // /* -------------------------------------------------------------------------- */
// // /* CONTROLLERS                                 */
// // /* -------------------------------------------------------------------------- */

// // const scheduleLecture = async (req, res) => {
// //   try {
// //     const { courseId, title, scheduledStart, scheduledEnd } = req.body;

// //     if (!courseId || !title || !scheduledStart || !scheduledEnd) {
// //       return res.status(400).json({ success: false, message: "All fields are required" });
// //     }

// //     if (new Date(scheduledStart) >= new Date(scheduledEnd)) {
// //       return res.status(400).json({ success: false, message: "End time must be after start time" });
// //     }

// //     const course = await Course.findById(courseId);
// //     if (!course) return res.status(404).json({ success: false, message: "Course not found" });

// //     if (course.teacher.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ success: false, message: "Only course teacher can schedule lectures" });
// //     }

// //     const lecture = await Lecture.create({
// //       course: courseId,
// //       teacher: req.user._id,
// //       title,
// //       scheduledStart,
// //       scheduledEnd,
// //       attendance: [] // Initialize empty attendance array
// //     });

// //     res.status(201).json({ success: true, lecture });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // /**
// //  * JOIN LECTURE
// //  * - Blocks students if not started.
// //  * - Blocks user if already joined (Single Device).
// //  * - Updates/Creates attendance record with `lastJoinedAt`.
// //  */
// // const joinLecture = async (req, res) => {
// //   try {
// //     const { lectureId } = req.params;
// //     const userId = req.user._id;

// //     const lecture = await Lecture.findById(lectureId);
// //     if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

// //     const isTeacher = lecture.teacher.toString() === userId.toString();

// //     // 1. Time & Status Checks
// //     if (lecture.status === "ended") {
// //       return res.status(403).json({ success: false, message: "Lecture has ended" });
// //     }

// //     const now = new Date();
// //     // Teacher can join anytime to start it. Students must wait for "live".
// //     if (!isTeacher) {
// //       if (lecture.status !== "live") {
// //          return res.status(403).json({ success: false, message: "Waiting for host to start the lecture" });
// //       }
// //     } else {
// //         // If teacher joins, set status to live if it's upcoming
// //         if (lecture.status === "upcoming") {
// //             lecture.status = "live";
// //             // Optional: You might want to set actualStartTime here if not set
// //             if(!lecture.actualStartTime) lecture.actualStartTime = now;
// //         }
// //     }

// //     // 2. Attendance & Single Device Logic
// //     // Find existing attendance record for this user
// //     let attendanceRecord = lecture.attendance.find(r => r.student.toString() === userId.toString());

// //     if (attendanceRecord) {
// //         // SINGLE DEVICE CHECK: If lastJoinedAt is not null, they are currently considered "online"
// //         // Note: Use a small timeout threshold (e.g. 30s) to allow refresh if needed, otherwise strict lock.
// //         // Here implementing strict lock as requested.
// //         if (attendanceRecord.lastJoinedAt && !isTeacher) { 
// //              // Allow teacher to rejoin freely, restrict students
// //              return res.status(409).json({ success: false, message: "You are already joined from another device/tab." });
// //         }

// //         // REJOIN: Update existing doc
// //         attendanceRecord.lastJoinedAt = now;
// //     } else {
// //         // NEW JOIN: Create new doc
// //         lecture.attendance.push({
// //             student: userId,
// //             lastJoinedAt: now,
// //             totalJoinedMs: 0,
// //             present: false
// //         });
// //     }

// //     await lecture.save();

// //     res.json({ success: true, lecture, status: lecture.status });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // /**
// //  * LEAVE LECTURE (Called by cleanup/beforeUnload)
// //  * - Calculates duration: total += (now - lastJoinedAt)
// //  * - Sets lastJoinedAt = null (freeing up the device lock)
// //  */
// // const leaveLecture = async (req, res) => {
// //     try {
// //         const { lectureId } = req.params;
// //         const userId = req.user._id;

// //         const lecture = await Lecture.findById(lectureId);
// //         if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

// //         const attendanceRecord = lecture.attendance.find(r => r.student.toString() === userId.toString());

// //         if (attendanceRecord && attendanceRecord.lastJoinedAt) {
// //             const now = Date.now();
// //             const sessionDuration = now - new Date(attendanceRecord.lastJoinedAt).getTime();

// //             attendanceRecord.totalJoinedMs = (attendanceRecord.totalJoinedMs || 0) + sessionDuration;
// //             attendanceRecord.lastJoinedAt = null; // Mark as offline

// //             await lecture.save();
// //         }

// //         res.json({ success: true, message: "Logged out of lecture" });
// //     } catch (error) {
// //         console.error("Leave Lecture Error:", error);
// //         res.status(500).json({ success: false, message: error.message });
// //     }
// // };

// // /**
// //  * END LECTURE (Admin Only)
// //  * - Ends Stream Call
// //  * - Calculates final attendance for everyone
// //  * - Marks 'Present' if > 50% time
// //  */
// // const endLecture = async (req, res) => {
// //   try {
// //     const { lectureId } = req.params;
// //     const userId = req.user._id;

// //     const lecture = await Lecture.findById(lectureId);
// //     if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

// //     if (lecture.teacher.toString() !== userId.toString()) {
// //       return res.status(403).json({ success: false, message: "Only teacher can end lecture" });
// //     }

// //     // 1. End Stream Call
// //     try {
// //       const call = serverClient.call("default", lecture._id.toString());
// //       await call.end(); // This triggers call.ended event on frontend
// //     } catch (err) {
// //       console.error("Stream End Error:", err.message);
// //     }

// //     // 2. Finalize Attendance
// //     const now = new Date();
// //     // Calculate expected duration based on schedule (or actual start time if you tracked it)
// //     const lectureDurationMs = new Date(lecture.scheduledEnd).getTime() - new Date(lecture.scheduledStart).getTime();
// //     const thresholdMs = lectureDurationMs * 0.5; // 50% rule

// //     lecture.attendance.forEach(record => {
// //         // If user is still "online" (lastJoinedAt is set), close their session
// //         if (record.lastJoinedAt) {
// //             const currentSession = now.getTime() - new Date(record.lastJoinedAt).getTime();
// //             record.totalJoinedMs = (record.totalJoinedMs || 0) + currentSession;
// //             record.lastJoinedAt = null;
// //         }

// //         // Apply 50% Logic
// //         if (record.totalJoinedMs >= thresholdMs) {
// //             record.present = true;
// //         } else {
// //             record.present = false;
// //         }
// //     });

// //     lecture.status = "ended";
// //     lecture.endedAt = now;
// //     await lecture.save();

// //     res.json({ success: true, message: "Lecture ended and attendance finalized", lecture });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ success: false, message: "Internal server error" });
// //   }
// // };

// // const getLecture = async (req, res) => {
// //     // ... (Keep existing logic, ensure it handles status properly)
// //     try {
// //         const { lectureId } = req.params;
// //         // ... (Basic validation as in your provided code) ...

// //         const lecture = await Lecture.findById(lectureId).populate("course");
// //         if(!lecture) return res.status(404).json({success:false, message:"Not found"});

// //         const isAdmin = lecture.teacher.toString() === req.user._id.toString();

// //         // Simple state return
// //         res.status(200).json({
// //             success: true,
// //             lecture,
// //             isAdmin,
// //             lectureState: lecture.status // "upcoming", "live", "ended"
// //         });
// //     } catch (err) {
// //         res.status(500).json({success:false});
// //     }
// // };

// // const getCourseLectures = async (req, res) => {
// //   try {
// //     const { courseId } = req.params;
// //     // const isCourseAdmin = req.isCourseAdmin;

// //     const course = await Course.findById(courseId);
// //     if (!course) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Course not found"
// //       });
// //     }

// //     const isTeacher =
// //       course.teacher.toString() === req.user._id.toString();

// //     const isStudent =
// //       course.students.some(
// //         id => id.toString() === req.user.email.toString()
// //       );

// //     if (!isTeacher && !isStudent) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "You are not enrolled in this course"
// //       });
// //     }

// //     const lectures = await Lecture.find({ course: courseId })
// //       .sort({ createdAt: -1 });

// //     res.json({
// //       success: true,
// //       lectures,
// //       isCourseAdmin: req.isCourseAdmin
// //     });

// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };


// // const finalizeAttendance = async (req, res) => {
// //   try {
// //     const { lectureId } = req.params;

// //     const lecture = await Lecture.findById(lectureId);

// //     if (!lecture) {
// //       return res.status(404).json({ success: false, message: "Lecture not found" });
// //     }

// //     // Only teacher can finalize
// //     if (lecture.teacher.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ success: false, message: "Unauthorized" });
// //     }

// //     // Calculate lecture duration in milliseconds
// //     const lectureDuration = new Date(lecture.scheduledEnd) - new Date(lecture.scheduledStart);

// //     lecture.attendance.forEach(record => {
// //       // Include any ongoing session if student is still connected
// //       if (record.lastJoinedAt) {
// //         record.totalJoinedMs += new Date() - new Date(record.lastJoinedAt);
// //         record.lastJoinedAt = null;
// //       }

// //       // Mark present if >= 50%
// //       record.present = record.totalJoinedMs >= lectureDuration / 2;
// //     });

// //     lecture.status = "ended"; // Ensure lecture is ended
// //     await lecture.save();

// //     res.json({
// //       success: true,
// //       message: "Attendance finalized",
// //       attendance: lecture.attendance
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // const getAllLecturesByUser = async (req, res) => {
// //   try {
// //     const userId = req.user?._id;
// //     const userEmail = req.user?.email;

// //     // Authentication check
// //     if (!userId) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Not authenticated"
// //       });
// //     }

// //     const now = new Date();

// //     /**
// //      * 1. Lectures created by the user (Teacher)
// //      */
// //     const lecturesFromMyCreation = await Lecture.find({
// //       teacher: userId,
// //       status: { $in: ["upcoming", "live"] },
// //     })
// //       .populate({
// //         path: "course",
// //         select: "title"
// //       })
// //       .sort({ createdAt: -1 }); // nearest first

// //     /**
// //      * 2. Lectures where user is enrolled as student
// //      *    - Find courses where user is a student
// //      *    - Then find upcoming lectures for those courses
// //      */
// //     const enrolledCourses = await Course.find(
// //       { students: userEmail },
// //       { _id: 1 }
// //     );

// //     const enrolledCourseIds = enrolledCourses.map(course => course._id);

// //     const lecturesFromEnrollment = await Lecture.find({
// //       course: { $in: enrolledCourseIds },
// //       status: { $in: ["upcoming", "live"] },
// //     })
// //       .populate({
// //         path: "course",
// //         select: "title"
// //       })
// //       .sort({ createdAt: -1 }); // nearest first

// //     return res.status(200).json({
// //       success: true,
// //       lecturesFromMyCreation,
// //       lecturesFromEnrollment
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };

// // // ... export other functions (getCourseLectures, getAllLecturesByUser) ...

// // export default {
// //   scheduleLecture,
// //   joinLecture,
// //   leaveLecture, // Export new function
// //   endLecture,
// //   getLecture,
// //   getCourseLectures,
// //   finalizeAttendance,
// //   getAllLecturesByUser,
// //   // ... others
// // };

// import Lecture from "../models/lecture.model.js";
// import Course from "../models/course.model.js";
// import mongoose from "mongoose";
// import { StreamChat } from "stream-chat";

// // Initialize Stream Client (Server Side)
// const serverClient = new StreamChat(
//   process.env.STREAM_API_KEY,
//   process.env.STREAM_API_SECRET
// );

// /* -------------------------------------------------------------------------- */
// /* CONTROLLERS                                 */
// /* -------------------------------------------------------------------------- */

// const scheduleLecture = async (req, res) => {
//   try {
//     const { courseId, title, scheduledStart, scheduledEnd } = req.body;

//     if (!courseId || !title || !scheduledStart || !scheduledEnd) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     if (new Date(scheduledStart) >= new Date(scheduledEnd)) {
//       return res.status(400).json({ success: false, message: "End time must be after start time" });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ success: false, message: "Course not found" });

//     if (course.teacher.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, message: "Only course teacher can schedule lectures" });
//     }

//     const lecture = await Lecture.create({
//       course: courseId,
//       teacher: req.user._id,
//       title,
//       scheduledStart,
//       scheduledEnd,
//       attendance: [] // Initialize empty attendance array
//     });

//     res.status(201).json({ success: true, lecture });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * JOIN LECTURE
//  * - Blocks students if not started.
//  * - Blocks user if already joined (Single Device).
//  * - Updates/Creates attendance record with `lastJoinedAt`.
//  */
// const joinLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const userId = req.user._id;

//     if (!userId) {
//         return res.status(401).json({ success: false, message: "User not authenticated" });
//     }

//     const lecture = await Lecture.findById(lectureId);
//     if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

//     const isTeacher = lecture.teacher.toString() === userId.toString();

//     // 1. Time & Status Checks
//     if (lecture.status === "ended") {
//       return res.status(403).json({ success: false, message: "Lecture has ended" });
//     }

//     const now = new Date();
//     // Teacher can join anytime to start it. Students must wait for "live".
//     if (!isTeacher) {
//       if (lecture.status !== "live") {
//          return res.status(403).json({ success: false, message: "Waiting for host to start the lecture" });
//       }
//     } else {
//         // If teacher joins, set status to live if it's upcoming
//         if (lecture.status === "upcoming") {
//             lecture.status = "live";
//             if(!lecture.actualStartTime) lecture.actualStartTime = now;
//         }
//     }

//     // 2. Attendance & Single Device Logic
//     // FIX: Added (r.student && ...) check to prevent crash if data is corrupt
//     let attendanceRecord = lecture.attendance.find(
//         r => r.student && r.student.toString() === userId.toString()
//     );

//     if (attendanceRecord) {
//         // SINGLE DEVICE CHECK
//         // If lastJoinedAt is set, they are currently considered "online"
//         if (attendanceRecord.lastJoinedAt && !isTeacher) { 
//              return res.status(409).json({ success: false, message: "You are already joined from another device/tab." });
//         }

//         // REJOIN: Update existing doc
//         attendanceRecord.lastJoinedAt = now;
//     } else {
//         // NEW JOIN: Create new doc
//         lecture.attendance.push({
//             student: userId,
//             lastJoinedAt: now,
//             totalJoinedMs: 0,
//             present: false
//         });
//     }

//     await lecture.save();

//     res.json({ success: true, lecture, status: lecture.status });

//   } catch (error) {
//     console.error("Join Lecture Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * LEAVE LECTURE (Called by cleanup/beforeUnload)
//  * - Calculates duration: total += (now - lastJoinedAt)
//  * - Sets lastJoinedAt = null (freeing up the device lock)
//  */
// const leaveLecture = async (req, res) => {
//     try {
//         const { lectureId } = req.params;
//         const userId = req.user._id;

//         if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//         const lecture = await Lecture.findById(lectureId);
//         if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

//         // FIX: Added (r.student && ...) check here too
//         const attendanceRecord = lecture.attendance.find(
//             r => r.student && r.student.toString() === userId.toString()
//         );

//         if (attendanceRecord && attendanceRecord.lastJoinedAt) {
//             const now = Date.now();
//             const sessionDuration = now - new Date(attendanceRecord.lastJoinedAt).getTime();

//             attendanceRecord.totalJoinedMs = (attendanceRecord.totalJoinedMs || 0) + sessionDuration;
//             attendanceRecord.lastJoinedAt = null; // Mark as offline

//             await lecture.save();
//         }

//         res.json({ success: true, message: "Logged out of lecture" });
//     } catch (error) {
//         console.error("Leave Lecture Error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// /**
//  * END LECTURE (Admin Only)
//  * - Ends Stream Call
//  * - Calculates final attendance for everyone
//  * - Marks 'Present' if > 50% time
//  */
// const endLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const userId = req.user._id;

//     const lecture = await Lecture.findById(lectureId);
//     if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

//     if (lecture.teacher.toString() !== userId.toString()) {
//       return res.status(403).json({ success: false, message: "Only teacher can end lecture" });
//     }

//     // 1. End Stream Call
//     try {
//       const call = serverClient.call("default", lecture._id.toString());
//       await call.end();
//     } catch (err) {
//       console.error("Stream End Error (Ignored):", err.message);
//     }

//     // 2. Finalize Attendance
//     const now = new Date();
//     // Use scheduled duration for calculation
//     const start = new Date(lecture.scheduledStart).getTime();
//     const end = new Date(lecture.scheduledEnd).getTime();
//     const lectureDurationMs = end - start;

//     // Safety check for duration (e.g., if duration is 0 or negative, default to 1 hour)
//     const validDuration = lectureDurationMs > 0 ? lectureDurationMs : 3600000;
//     const thresholdMs = validDuration * 0.5; // 50% rule

//     lecture.attendance.forEach(record => {
//         // If user is still "online", close their session
//         if (record.lastJoinedAt) {
//             const currentSession = now.getTime() - new Date(record.lastJoinedAt).getTime();
//             record.totalJoinedMs = (record.totalJoinedMs || 0) + currentSession;
//             record.lastJoinedAt = null;
//         }

//         // Apply 50% Logic
//         if (record.totalJoinedMs >= thresholdMs) {
//             record.present = true;
//         } else {
//             record.present = false;
//         }
//     });

//     lecture.status = "ended";
//     lecture.endedAt = now;
//     await lecture.save();

//     res.json({ success: true, message: "Lecture ended and attendance finalized", lecture });

//   } catch (error) {
//     console.error("End Lecture Error:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// const getLecture = async (req, res) => {
//     try {
//         const { lectureId } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(lectureId)) {
//             return res.status(400).json({ success: false, message: "Invalid ID" });
//         }

//         const lecture = await Lecture.findById(lectureId).populate("course");
//         if(!lecture) return res.status(404).json({success:false, message:"Not found"});

//         const isAdmin = lecture.teacher.toString() === req.user._id.toString();

//         res.status(200).json({
//             success: true,
//             lecture,
//             isAdmin,
//             lectureState: lecture.status
//         });
//     } catch (err) {
//         console.error("Get Lecture Error:", err);
//         res.status(500).json({success:false});
//     }
// };

// const getCourseLectures = async (req, res) => {
//     try {
//       const { courseId } = req.params;

//       const course = await Course.findById(courseId);
//       if (!course) {
//         return res.status(404).json({ success: false, message: "Course not found" });
//       }

//       // Simple check if user is teacher or student
//       const isTeacher = course.teacher.toString() === req.user._id.toString();
//       const isStudent = course.students.some(id => id.toString() === req.user._id.toString());

//       if (!isTeacher && !isStudent) {
//         // Double check using email if ID didn't match (legacy support)
//         const isStudentEmail = course.students.some(email => email === req.user.email);
//         if(!isStudentEmail) {
//             return res.status(403).json({ success: false, message: "Not enrolled" });
//         }
//       }

//       const lectures = await Lecture.find({ course: courseId }).sort({ scheduledStart: 1 });

//       res.json({
//         success: true,
//         lectures,
//         isCourseAdmin: isTeacher
//       });

//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

//   const getAllLecturesByUser = async (req, res) => {
//     try {
//       const userId = req.user?._id;
//       const userEmail = req.user?.email;

//       if (!userId) {
//         return res.status(401).json({ success: false, message: "Not authenticated" });
//       }

//       // 1. Created by User
//       const lecturesFromMyCreation = await Lecture.find({
//         teacher: userId,
//         status: { $in: ["upcoming", "live"] },
//       }).populate({ path: "course", select: "title" }).sort({ scheduledStart: 1 });

//       // 2. User Enrolled
//       const enrolledCourses = await Course.find(
//         { students: userEmail },
//         { _id: 1 }
//       );
//       const enrolledCourseIds = enrolledCourses.map(c => c._id);

//       const lecturesFromEnrollment = await Lecture.find({
//         course: { $in: enrolledCourseIds },
//         status: { $in: ["upcoming", "live"] },
//       }).populate({ path: "course", select: "title" }).sort({ scheduledStart: 1 });

//       return res.status(200).json({
//         success: true,
//         lecturesFromMyCreation,
//         lecturesFromEnrollment
//       });

//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   };

// const lectureController = {
//   scheduleLecture,
//   joinLecture,
//   leaveLecture,
//   endLecture,
//   getLecture,
//   getCourseLectures,
//   getAllLecturesByUser
// };

// export default lectureController;


import Lecture from "../models/lecture.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";
import { StreamChat } from "stream-chat";
import User from "../models/user.model.js";

// Initialize Stream Client
const serverClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET,
  { timeout: 10000 }
);

/* -------------------------------------------------------------------------- */
/* CONTROLLERS                                                                */
/* -------------------------------------------------------------------------- */

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
// const joinLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const userId = req.user._id;

//     if (!userId) {
//         return res.status(401).json({ success: false, message: "User not authenticated" });
//     }

//     const lecture = await Lecture.findById(lectureId);
//     if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

//     const isTeacher = lecture.teacher.toString() === userId.toString();

//     // 1. Time & Status Checks
//     if (lecture.status === "ended") {
//       return res.status(403).json({ success: false, message: "Lecture has ended" });
//     }

//     const now = new Date();
//     // Teacher can join anytime to start it. Students must wait for "live".
//     if (!isTeacher) {
//       if (lecture.status !== "live") {
//          return res.status(403).json({ success: false, message: "Waiting for host to start the lecture" });
//       }
//     } else {
//         // If teacher joins, set status to live if it's upcoming
//         if (lecture.status === "upcoming") {
//             lecture.status = "live";
//             lecture.startsAt = now; // Set actual start time
//         }
//     }

//     // 2. Attendance & Single Device Logic
//     // FIX: Ensure we check if r.student exists before toString()
//     let attendanceRecord = lecture.attendance.find(
//         r => r.student && r.student.toString() === userId.toString()
//     );

//     if (attendanceRecord) {
//         // SINGLE DEVICE CHECK
//         // If lastJoinedAt is set, they are currently considered "online"
//         if (attendanceRecord.lastJoinedAt && !isTeacher) { 
//              return res.status(409).json({ success: false, message: "You are already joined from another device/tab." });
//         }

//         // REJOIN: Update existing doc
//         attendanceRecord.lastJoinedAt = now;
//     } else {
//         // NEW JOIN: Create new doc
//         lecture.attendance.push({
//             student: userId,
//             lastJoinedAt: now,
//             totalJoinedMs: 0,
//             present: false
//         });
//     }

//     await lecture.save();

//     res.json({ success: true, lecture, status: lecture.status });

//   } catch (error) {
//     console.error("Join Lecture Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


/**
 * JOIN LECTURE
 */
/**
 * JOIN LECTURE
 * - Validates User & Course Enrollment
 * - Checks Time/Status
 * - Enforces Single Device Policy
 * - Updates Attendance
 */

// const joinLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const userId = req.user._id;
//     const userEmail = req.user.email;

//     if (!userId) {
//         return res.status(401).json({ success: false, message: "User not authenticated" });
//     }

//     // 1. Fetch Lecture AND Course to verify enrollment
//     const lecture = await Lecture.findById(lectureId).populate("course");
//     if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

//     const isTeacher = lecture.teacher.toString() === userId.toString();

//     // 2. Enrollment Check (Security)
//     if (!isTeacher) {
//         const isEnrolled = lecture.course.students.some(
//             studentId => studentId.toString() === userEmail.toString()
//         );

//         if (!isEnrolled) {
//             return res.status(403).json({ success: false, message: "You are not enrolled in this course." });
//         }
//     }

//     // 3. Status Checks
//     if (lecture.status === "ended") {
//       return res.status(403).json({ success: false, message: "Lecture has ended." });
//     }

//     // Students must wait for "live"
//     if (!isTeacher && lecture.status !== "live") {
//          return res.status(403).json({ success: false, message: "Waiting for host to start the lecture." });
//     }

//     const now = new Date();

//     // 4. Teacher Start Logic
//     if (isTeacher && lecture.status === "upcoming") {
//         lecture.status = "live";
//         lecture.startsAt = now;
//     }

//     // 5. Attendance & Single Device Logic
//     // Find existing record safely
//     let attendanceRecord = lecture.attendance.find(
//         r => r.student && r.student.toString() === userId.toString()
//     );

//     if (attendanceRecord) {
//         // SINGLE DEVICE CHECK
//         // If lastJoinedAt is set, they are currently considered "online"
//         // We allow Teachers to bypass this so they can rejoin if they refresh
//         if (attendanceRecord.lastJoinedAt && !isTeacher) { 
//              return res.status(409).json({ success: false, message: "You are already joined from another device or tab." });
//         }

//         // REJOIN: Update lastJoinedAt so we can track this new session duration
//         attendanceRecord.lastJoinedAt = now;
//     } else {
//         // NEW JOIN: Create new attendance document
//         lecture.attendance.push({
//             student: userId,
//             lastJoinedAt: now,
//             totalJoinedMs: 0,
//             present: false
//         });
//     }

//     await lecture.save();

//     res.json({ success: true, lecture, status: lecture.status });

//   } catch (error) {
//     console.error("Join Lecture Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

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

    const lectures = await Lecture.find({ course: courseId }).sort({ createdAt: -1 });

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
    }).populate({ path: "course", select: "title" }).sort({ scheduledStart: 1 });

    const enrolledCourses = await Course.find(
      { students: userEmail },
      { _id: 1 }
    );
    const enrolledCourseIds = enrolledCourses.map(c => c._id);

    const lecturesFromEnrollment = await Lecture.find({
      course: { $in: enrolledCourseIds },
      status: { $in: ["upcoming", "live"] },
    }).populate({ path: "course", select: "title" }).sort({ scheduledStart: 1 });

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


const lectureController = {
  scheduleLecture,
  joinLecture,
  leaveLecture,
  endLecture,
  getLecture,
  getCourseLectures,
  getAllLecturesByUser,
  finalizeAttendance,
  markMissedLectures
};

export default lectureController;