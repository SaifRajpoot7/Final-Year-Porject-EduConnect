import {
  LayoutDashboard,
  BookOpen,
  Video,
  HelpCircle,
  ClipboardList,
  Settings,
  Users,
  Megaphone,
  FileText,
  UserCog,
  MessageSquareHeart,
  MessageSquare,
  ShieldMinus,
} from "lucide-react";

export const generalMenu = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: BookOpen,
    text: "Courses",
    link: "#",
    sub: [
      { text: "All Courses", link: "/courses/all" },
      { text: "Created Courses", link: "/courses/created" },
      { text: "Enrolled Courses", link: "/courses/enrolled" },
      { text: "Create Course", link: "/courses/create" },
    ],
  },
  {
    icon: Video,
    text: "Lectures",
    link: "/lectures",
  },
  {
    icon: HelpCircle,
    text: "Quizzes",
    link: "/quizzes",
  },
  {
    icon: ClipboardList,
    text: "Assignments",
    link: "/Assignments",
  },
  // {
  //   icon: Settings,
  //   text: "Settings",
  //   link: "/settings",
  // },
];

export const courseMenuTeacher = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: Video,
    text: "Lectures",
    link: "#",
    sub: [
      { text: "All Lectures", link: "/lectures" },
      { text: "Add Lecture", link: "/lecture/add", admin: true },
    ],
  },
  {
    icon: HelpCircle,
    text: "Quizzes",
    link: "#",
    sub: [
      { text: "All Quizzes", link: "/quizzes" },
      { text: "Create Quiz", link: "/quiz/create", admin: true },
    ],
  },
  {
    icon: ClipboardList,
    text: "Assignments",
    link: "#",
    sub: [
      { text: "All Assignments", link: "/assignments" },
      { text: "Create Assignment", link: "/assignment/create", admin: true },
    ],
  },
  {
    icon: Users,
    text: "Students",
    link: "#",
    sub: [
      { text: "All Students", link: "/course-students" },
      { text: "Add Students", link: "/students/add", admin: true },
    ],
  },
  {
    icon: Megaphone,
    text: "Announcements",
    link: "/announcements",
  },

  {
    icon: Settings,
    text: "Settings",
    link: "/settings",
  },
];

export const courseMenuStudent = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: Video,
    text: "My Lectures",
    link: "/lectures",
  },
  {
    icon: HelpCircle,
    text: "My Quizzes",
    link: "/quizzes",
  },
  {
    icon: ClipboardList,
    text: "My Assignments",
    link: "/assignments",
  },
  {
    icon: Users,
    text: "My Classmates",
    link: "/course-mates",
  },
  {
    icon: Megaphone,
    text: "Announcements",
    link: "/announcements",
  },
];

export const superAdminMenu = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    link: "admin-dashboard",
  },
  {
    icon: UserCog,
    text: "User Management",
    link: "admin/user-management",
  },
  {
    icon: ShieldMinus,
    text: "Account Activation Appeals",
    link: "admin/account-activation-appeals",
  },
  {
    icon: MessageSquare,
    text: "Feedbacks",
    link: "admin/feedbacks",
  },
];