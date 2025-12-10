// src/data/menuItems.js
import {
  LayoutDashboard,
  BookOpen,
  Video,
  HelpCircle,
  ClipboardList,
  Settings,
  Users,
  Megaphone,
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
    link: "#",
    sub: [
      { text: "Completed Lectures", link: "/lectures/completed" },
      { text: "Upcoming Lectures", link: "/lectures/upcoming" },
    ],
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
  {
    icon: Settings,
    text: "Settings",
    link: "/settings",
  },
];

export const courseMenu = [
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
    link: "/quizzes",
  },
  {
    icon: ClipboardList,
    text: "Assignments",
    link: "#",
    sub: [
      { text: "Assignments", link: "/assignments" },
      { text: "Create Assignments", link: "/assignment/create", admin: true },
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