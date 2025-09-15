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




function AppRouter() {
  return (
    
      <Routes>
        {/* Dashboard layout with nested routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Courses */}
          <Route path="courses" element={<AllCoursesPage />} />
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

          <Route path="course/:id/dashboard" element={<CourseDashboardPage />} />
          <Route path="course/:id" element={<CourseDashboardPage />} />
          <Route path="course/:id/lectures" element={<CourseAllLecturesPage />} />
          <Route path="course/:id/lecture/add" element={<CreateLecturePage />} />
          <Route path="course/:id/assignments" element={<CourseAssignmentPage />} />
          <Route path="course/:id/quizzes" element={<CourseAllQuizzesPage />} />
          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
        </Route>
        <Route path="lecture/live" element={<LiveLecturePage />} />
      </Routes>
  );
}

export default AppRouter;
