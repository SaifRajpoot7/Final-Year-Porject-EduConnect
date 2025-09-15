// src/data/menuItems.js
import {
  LayoutDashboard,
  BookOpen,
  Video,
  HelpCircle,
  ClipboardList,
  Settings,
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
      { text: "All Courses", link: "/courses" },
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
      { text: "Add Lecture", link: "/lecture/add" },
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
    link: "/assignments",
  },
  {
    icon: Settings,
    text: "Settings",
    link: "/settings",
  },
];