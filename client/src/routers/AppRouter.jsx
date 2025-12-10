import { BrowserRouter as Router, Routes, Route } from "react-router";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CourseDashboardPage from "../pages/dashboard/CourseDashboardPage";
import AllCoursesPage from "../pages/courses/AllCoursesPage";
import CreatedCoursesPage from "../pages/courses/CreatedCoursesPage"
import EnrolledCoursesPage from "../pages/courses/EnrolledCoursesPage"
import CreateCoursePage from "../pages/courses/CreateCoursePage";
import CompletedLecturesPage from "../pages/lectures/CompletedLecturesPage"
import UpcomingLecturesPage from "../pages/lectures/UpcomingLecturesPage"
import QuizzesPage from "../pages/quiz/QuizzesPage"
import AssignmentsPage from "../pages/assignment/AssignmentsPage"
import SettingPage from "../pages/settings/SettingPage"
import CourseAllLecturesPage from "../pages/lectures/CourseAllLecturesPage"
import CreateLecturePage from "../pages/lectures/CreateLecturePage"
import CourseAssignmentPage from "../pages/assignment/CourseAssignmentPage"
import CourseAllQuizzesPage from "../pages/quiz/CourseAllQuizzesPage"
import ProfilePage from "../pages/profile/ProfilePage"
import ProfileEditPage from "../pages/profile/ProfileEditPage"
import LiveLecturePage from "../pages/lectures/LiveLecturePage";
import PrivateRouteProtector from "../routeProtector/PrivateRouteProtector";
import SignInPage from "../pages/auth/SignInPage";
import PublicRouteProtector from "../routeProtector/PublicRouteProtector";
import FullPageLayout from "../layout/FullPageLayout";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage";
import IndexPage from "../pages/public/IndexPage";
import SignUpPage from "../pages/auth/SignUpPage";
import CreateAssignmentPage from "../pages/assignment/CreateAssignmentPage";
import StudentsPage from "../pages/students/StudentsPage";
import AddStudentsPage from "../pages/students/AddStudentsPage";
import CourseLayout from "../layout/CourseLayout";
import AssignmentSubmissionRecordPage from "../pages/assignment/AssignmentSubmissionRecordPage";
import CreateQuizPage from "../pages/quiz/CreateQuizPage";
import QuizSubmissionRecordPage from "../pages/quiz/QuizSubmissionRecordPage";

function AppRouter() {
  return (

    <Routes>
      {/* Dashboard layout with nested routes */}
      < Route path="/" element={<FullPageLayout />} >
        <Route index element={<IndexPage />} />

        <Route path="account-verification" element={<EmailVerificationPage />} />

        < Route element={<PublicRouteProtector />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>
        < Route element={<PrivateRouteProtector />}>
        </Route>
      </Route>

      < Route element={<PrivateRouteProtector />}>
        <Route path="/" element={<DashboardLayout />}>

          <Route path="dashboard" element={<DashboardPage />} />

          {/* Courses */}
          <Route path="courses/all" element={<AllCoursesPage />} />
          <Route path="courses/created" element={<CreatedCoursesPage />} />
          <Route path="courses/enrolled" element={<EnrolledCoursesPage />} />
          <Route path="courses/create" element={<CreateCoursePage />} />

          {/* Lectures */}
          <Route path="lectures/completed" element={<CompletedLecturesPage />} />
          <Route path="lectures/upcoming" element={<UpcomingLecturesPage />} />

          {/* Quizzes & Assignments */}
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingPage />} />

          {/* Course Details */}
          < Route path="course/:id" element={<CourseLayout />}>

            <Route index element={<CourseDashboardPage />} />
            <Route path="dashboard" element={<CourseDashboardPage />} />
            <Route path="lectures" element={<CourseAllLecturesPage />} />
            <Route path="lecture/add" element={<CreateLecturePage />} />

            {/* Assignment */}
            <Route path="assignments" element={<CourseAssignmentPage />} />
            <Route path="assignment/create" element={<CreateAssignmentPage />} />
            <Route path="assignments/:assignmentId" element={<AssignmentSubmissionRecordPage />} />
            
            {/* Quiz */}
            <Route path="quizzes" element={<CourseAllQuizzesPage />} />
            <Route path="quiz/create" element={<CreateQuizPage />} />
            <Route path="quizzes/:quizId" element={<QuizSubmissionRecordPage />} />

            {/* Student */}
            <Route path="course-students" element={<StudentsPage />} />
            <Route path="students/add" element={<AddStudentsPage />} />
            {/* <Route path="announcements" element={<AnnouncementPage />} /> */}

          </Route>

          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
        </Route>
        <Route path="lecture/live" element={<LiveLecturePage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
