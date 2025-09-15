import React from "react";
import { Star } from "lucide-react"; // optional: for rating icon
// import getCurrentDateTime from "../utils/getCurrentDateTime"
import { Link } from "react-router";
import formatCustomDateTime from "../utils/formatCustomDateTime";

const LectureCard = (LecutreData) => {
    return (
        <Link
            to="/lecture/live"
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 border border-gray-200 flex flex-col overflow-hidden"
        >
            {/* Thumbnail */}
            <div className="h-40 w-full overflow-hidden">
                <img
                    src={LecutreData.lecture_thumbnail}
                    alt={LecutreData.lecture_title}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                <div className="flex items-center justify-between text-sm text-gray-700 mt-auto">
                    <span className="truncate max-w-[80%]"
                        title={LecutreData.course_name}
                    >{LecutreData.course_name}</span>
                </div>
                {/* Title */}
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 mb-1">
                    {LecutreData.lecture_title}
                </h3>

                {/* Instructor */}
                <p className="text-gray-500 text-xs sm:text-sm mb-2">{LecutreData.teacher_name}</p>
                <p className="text-gray-500 text-xs sm:text-sm mb-2">{formatCustomDateTime(LecutreData.start_time)}</p>

                {/* Rating & Meta */}
                {/* <div className="flex items-center text-xs text-gray-600 gap-1 mb-2">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{LecutreData.rating.toFixed(1)}</span>
          <span className="text-gray-400">({reviews})</span>
        </div> */}

                {/* Duration + Students */}
                <div className={`flex items-center justify-between text-sm font-medium ${new Date(LecutreData.start_time) > new Date() ? "text-green-600" : "text-[var(--Hover-Color)]"} mt-auto`} >
                    <span>
                        {new Date(LecutreData.start_time) > new Date() ? "Upcoming Lecture" : "Completed Lecture"}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default LectureCard;
