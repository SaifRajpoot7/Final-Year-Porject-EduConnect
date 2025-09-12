import React from "react";
import CourseCard from "../../components/CourseCard";

const AllCourses = () => {
  const courses = [
    {
      id: 1,
      thumbnail: "https://placehold.co/600x400?text=React+Course",
      title: "Mastering React for Beginners to Advanced",
      instructor: "Saif ur Rehman",
      rating: 4.7,
      reviews: 120,
      duration: "12h 30m",
      students: 540,
      link: "/courses/1",
    },
    {
      id: 2,
      thumbnail: "https://placehold.co/600x400?text=Node+Course",
      title: "Node.js Backend Development Crash Course",
      instructor: "John Doe",
      rating: 4.5,
      reviews: 85,
      duration: "9h 10m",
      students: 320,
      link: "/courses/2",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
