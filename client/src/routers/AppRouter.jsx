import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";
import FullPageLoaderComponent from "../components/FullPageLoaderComponent";
import SuperAdminSignInPage from "../pages/auth/Super Admin/SuperAdminSignInPage";
import PrivateRouteProtectorForSuperAdmins from "../routeProtector/PrivateRouteProtectorForSuperAdmins";
import SuperAdminDashboardPage from "../pages/dashboard/super admin/SuperAdminDashboardPage";
import UserManagementPage from "../pages/SuperAdmin/userManagement/UserManagementPage";
import AccountActivationAppealsPage from "../pages/SuperAdmin/accountActivationAppeals/AccountActivationAppealsPage";
import ShowAllFeedbackPage from "../pages/SuperAdmin/feedback/ShowAllFeedbackPage";
import DiscussionBoardPage from "../pages/disscusionBoard/DiscussionBoardPage";
import LectureAttendancePage from "../pages/lectures/LectureAttendancePage";
import LectureRecordingsPage from "../pages/lectures/LectureRecordingsPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import NotFoundPage from "../pages/public/NotFoundPage";

/* =========================
   Lazy Loaded Layouts
========================= */
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const FullPageLayout = lazy(() => import("../layout/FullPageLayout"));
const CourseLayout = lazy(() => import("../layout/CourseLayout"));
const LiveLectureLayout = lazy(() => import("../layout/LiveLectureLayout"));

/* =========================
   Lazy Loaded Route Protectors
========================= */
const PrivateRouteProtector = lazy(() =>
  import("../routeProtector/PrivateRouteProtector")
);
const PublicRouteProtector = lazy(() =>
  import("../routeProtector/PublicRouteProtector")
);

/* =========================
   Lazy Loaded Pages
========================= */
const IndexPage = lazy(() => import("../pages/public/IndexPage"));
const SignInPage = lazy(() => import("../pages/auth/SignInPage"));
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage"));
const EmailVerificationPage = lazy(() =>
  import("../pages/auth/EmailVerificationPage")
);

const DashboardPage = lazy(() =>
  import("../pages/dashboard/DashboardPage")
);
const CourseDashboardPage = lazy(() =>
  import("../pages/dashboard/CourseDashboardPage")
);

const AllCoursesPage = lazy(() =>
  import("../pages/courses/AllCoursesPage")
);
const CreatedCoursesPage = lazy(() =>
  import("../pages/courses/CreatedCoursesPage")
);
const EnrolledCoursesPage = lazy(() =>
  import("../pages/courses/EnrolledCoursesPage")
);
const CreateCoursePage = lazy(() =>
  import("../pages/courses/CreateCoursePage")
);

const CompletedLecturesPage = lazy(() =>
  import("../pages/lectures/CompletedLecturesPage")
);
const UpcomingLecturesPage = lazy(() =>
  import("../pages/lectures/UpcomingLecturesPage")
);
const CourseLecturesPage = lazy(() =>
  import("../pages/lectures/CourseLecturesPage")
);
const CreateLecturePage = lazy(() =>
  import("../pages/lectures/CreateLecturePage")
);
const LiveLecturePage = lazy(() =>
  import("../pages/lectures/LiveLecturePage")
);

const QuizzesPage = lazy(() => import("../pages/quiz/QuizzesPage"));
const CourseAllQuizzesPage = lazy(() =>
  import("../pages/quiz/CourseAllQuizzesPage")
);
const CreateQuizPage = lazy(() =>
  import("../pages/quiz/CreateQuizPage")
);
const QuizSubmissionRecordPage = lazy(() =>
  import("../pages/quiz/QuizSubmissionRecordPage")
);

const AssignmentsPage = lazy(() =>
  import("../pages/assignment/AssignmentsPage")
);
const CourseAssignmentPage = lazy(() =>
  import("../pages/assignment/CourseAssignmentPage")
);
const CreateAssignmentPage = lazy(() =>
  import("../pages/assignment/CreateAssignmentPage")
);
const AssignmentSubmissionRecordPage = lazy(() =>
  import("../pages/assignment/AssignmentSubmissionRecordPage")
);

const StudentsPage = lazy(() =>
  import("../pages/students/StudentsPage")
);
const AddStudentsPage = lazy(() =>
  import("../pages/students/AddStudentsPage")
);
const CourseMatesPage = lazy(() =>
  import("../pages/students/CourseMatesPage")
);

const AnnouncementPage = lazy(() =>
  import("../pages/announcement/AnnouncementPage")
);

const ProfilePage = lazy(() =>
  import("../pages/profile/ProfilePage")
);
const ProfileEditPage = lazy(() =>
  import("../pages/profile/ProfileEditPage")
);

const SettingPage = lazy(() =>
  import("../pages/settings/SettingPage")
);

const AccountBlockOrSuspendPage = lazy(() =>
  import("../pages/other/AccountBlockOrSuspendPage")
);

/* =========================
   App Router
========================= */
function AppRouter() {
  return (
    <Suspense fallback={<FullPageLoaderComponent />}>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<FullPageLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="home" element={<IndexPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="account-verification" element={<EmailVerificationPage />} />

          <Route element={<PublicRouteProtector />}>
            <Route path="signin" element={<SignInPage />} />
            <Route path="super-admin/signin" element={<SuperAdminSignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
          </Route>
        </Route>

        {/* Private Routes For Super Admin */}
        <Route element={<PrivateRouteProtectorForSuperAdmins />}>
          <Route path="/" element={<DashboardLayout />}>

            <Route path="admin-dashboard" element={<SuperAdminDashboardPage />} />
            {/* Profile */}
            <Route path="admin-profile" element={<ProfilePage />} />
            <Route path="admin-profile/edit" element={<ProfileEditPage />} />
            <Route path="admin/user-management" element={<UserManagementPage />} />
            <Route path="admin/account-activation-appeals" element={<AccountActivationAppealsPage />} />
            <Route path="admin/feedbacks" element={<ShowAllFeedbackPage />} />
            {/* Profile */}
            <Route path="admin/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Private Routes For Users */}
        <Route path="account-status" element={<AccountBlockOrSuspendPage />} />
        <Route element={<PrivateRouteProtector />}>
          <Route path="/" element={<DashboardLayout />}>

            <Route path="dashboard" element={<DashboardPage />} />

            {/* Courses */}
            <Route path="courses/all" element={<AllCoursesPage />} />
            <Route path="courses/created" element={<CreatedCoursesPage />} />
            <Route path="courses/enrolled" element={<EnrolledCoursesPage />} />
            <Route path="courses/create" element={<CreateCoursePage />} />

            {/* Lectures */}
            <Route path="lectures" element={<UpcomingLecturesPage />} />

            {/* Quizzes & Assignments */}
            <Route path="quizzes" element={<QuizzesPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />

            {/* Settings */}
            <Route path="settings" element={<SettingPage />} />

            {/* Course Details */}
            <Route path="course/:id" element={<CourseLayout />}>
              <Route index element={<CourseDashboardPage />} />
              <Route path="dashboard" element={<CourseDashboardPage />} />
              <Route path="lectures" element={<CourseLecturesPage />} />
              <Route path="lecture/add" element={<CreateLecturePage />} />
              <Route path="lectures/:lectureId/attendance" element={<LectureAttendancePage />} />
              <Route path="lectures/:lectureId/recordings" element={<LectureRecordingsPage />} />

              <Route path="assignments" element={<CourseAssignmentPage />} />
              <Route path="assignment/create" element={<CreateAssignmentPage />} />
              <Route
                path="assignments/:assignmentId"
                element={<AssignmentSubmissionRecordPage />}
              />

              <Route path="quizzes" element={<CourseAllQuizzesPage />} />
              <Route path="quiz/create" element={<CreateQuizPage />} />
              <Route
                path="quizzes/:quizId"
                element={<QuizSubmissionRecordPage />}
              />

              <Route path="course-students" element={<StudentsPage />} />
              <Route path="course-mates" element={<CourseMatesPage />} />
              <Route path="students/add" element={<AddStudentsPage />} />
              <Route path="discussion-board" element={<DiscussionBoardPage />} />
              <Route path="announcements" element={<AnnouncementPage />} />
            </Route>

            {/* Profile */}
            <Route path="profile" element={<ProfilePage />} />
            {/* <Route path="profile/edit" element={<ProfileEditPage />} /> */}

          </Route>

          {/* Live Lecture */}
          <Route path="lecture/live/:lectureId" element={<LiveLecturePage />} />
        </Route>

        <Route path="/" element={<FullPageLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>

      </Routes>
    </Suspense>
  );
}

export default AppRouter;
