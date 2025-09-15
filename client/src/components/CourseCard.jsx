import React from "react";
import { Link } from "react-router";

const CourseCard = (courseData) => {
  return (
    <Link
      to={`/course/${courseData.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 border border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={courseData.thumbnail}
          alt={courseData.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 mb-1">
          {courseData.title}
        </h3>

        {/* Instructor */}
        <p className="text-gray-500 text-xs sm:text-sm mb-2">{courseData.instructor}</p>
        {/* Course type */}
        <div className={`flex items-center justify-between text-sm font-medium ${courseData.role === "teacher" ? "text-[var(--Hover-Color)]" : "text-green-600"} mt-auto`} >
          <span>
            {courseData.role === "teacher" ? "My Course" : "Enrolled Course"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
