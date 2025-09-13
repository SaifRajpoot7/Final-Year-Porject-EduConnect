import React, { useState, useEffect } from "react";
import LectureCard from "../../components/LectureCard";
import PageTitle from "../../components/other/PageTitle";

const UpcomingLecturesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // lectures per page
  const [paginatedLectures, setPaginatedLectures] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ---- Fetch lectures ----
  const fetchLectures = async (page, limit, query) => {
    setLoading(true);

    const response = await fetch("/data/lectures.json");
    const data = await response.json();

    const now = new Date();

    // 1. Filter only upcoming lectures
    let upcoming = data.filter(
      (lecture) => new Date(lecture.start_time) > now
    );

    // 2. Search filter
    if (query.trim() !== "") {
      const q = query.toLowerCase();
      upcoming = upcoming.filter(
        (lecture) =>
          lecture.course_name.toLowerCase().includes(q) ||
          lecture.lecture_title.toLowerCase().includes(q) ||
          lecture.teacher_name.toString().toLowerCase().includes(q)
      );
    }

    // 3. Sort by start_time ascending (nearest first)
    upcoming.sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );

    // 4. Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageData = upcoming.slice(startIndex, endIndex);

    setPaginatedLectures(pageData);
    setTotalPages(Math.ceil(upcoming.length / limit));
    setLoading(false);
  };

  useEffect(() => {
    fetchLectures(page, limit, searchQuery);
  }, [page, searchQuery]);

  return (
    <div className="p-2 min-h-screen">
      <PageTitle
        title="Upcoming Lectures"
        subtitle="Stay on track with your upcoming lectures"
      />

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search lectures..."
          value={searchQuery}
          onChange={(e) => {
            setPage(1); // reset page when searching
            setSearchQuery(e.target.value);
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Lecture Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading lectures...</p>
      ) : paginatedLectures.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No upcoming lectures found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedLectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              id={lecture.id}
              lecture_number={lecture.lecture_number}
              course_name={lecture.course_name}
              lecture_title={lecture.lecture_title}
              lecture_thumbnail={lecture.lecture_thumbnail}
              start_time={lecture.start_time}
              teacher_name={lecture.teacher_name}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UpcomingLecturesPage;
