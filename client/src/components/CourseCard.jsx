import React from "react";
import { Star } from "lucide-react"; // optional: for rating icon

const CourseCard = ({
  thumbnail,
  title,
  instructor,
  rating,
  reviews,
  duration,
  students,
  link,
}) => {
  return (
    <a
      href={link}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 border border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 mb-1">
          {title}
        </h3>

        {/* Instructor */}
        <p className="text-gray-500 text-xs sm:text-sm mb-2">{instructor}</p>

        {/* Rating & Meta */}
        <div className="flex items-center text-xs text-gray-600 gap-1 mb-2">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-gray-400">({reviews})</span>
        </div>

        {/* Duration + Students */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span>⏱ {duration}</span>
          <span>👥 {students}</span>
        </div>
      </div>
    </a>
  );
};

export default CourseCard;
