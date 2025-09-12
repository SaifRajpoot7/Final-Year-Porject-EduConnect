// src/data/menuItems.js
import {
  LayoutDashboard,
  BookOpen,
  Video,
  HelpCircle,
  ClipboardList,
  Settings,
} from "lucide-react";

export const menuItems = [
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
      { text: "Live Lectures", link: "/lectures/live" },
      { text: "Recorded Lectures", link: "/lectures/recorded" },
    ],
  },
  {
    icon: HelpCircle,
    text: "Quizzes",
    link: "#",
    sub: [
      { text: "All Quizzes", link: "/quizzes" },
      { text: "Upcoming", link: "/quizzes/upcoming" },
      { text: "Completed", link: "/quizzes/completed" },
    ],
  },
  {
    icon: ClipboardList,
    text: "Assignments",
    link: "#",
    sub: [
      { text: "All Assignments", link: "/assignments" },
      { text: "Pending", link: "/assignments/pending" },
      { text: "Submitted", link: "/assignments/submitted" },
    ],
  },
  {
    icon: Settings,
    text: "Settings",
    link: "/settings",
  },
];
