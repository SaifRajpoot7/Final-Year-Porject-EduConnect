import React, { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import PageTitle from "../../components/other/PageTitle";
import CourseFilters from "../../components/CourseFilters";

const EnrolledCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // courses per page
  const [paginatedCourses, setPaginatedCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ---- Simulated backend fetch (from JSON) ----
//   const fetchCourses = async (page, limit, query, sort) => {
//     setLoading(true);

//     const response = await fetch("/data/courses.json"); // json file in public/data
//     const data = await response.json();

//     // Filtering
//     let filtered = data.filter(
//       (course) =>
//         course.title.toLowerCase().includes(query.toLowerCase()) ||
//         course.instructor.toLowerCase().includes(query.toLowerCase())
//     );

//     // Sorting
//     filtered.sort((a, b) => {
//       if (sort === "az") return a.title.localeCompare(b.title);
//       if (sort === "za") return b.title.localeCompare(a.title);
//       return b.id - a.id; // newest
//     });

//     // Pagination logic
//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;
//     const pageData = filtered.slice(startIndex, endIndex);

//     setPaginatedCourses(pageData);
//     setTotalPages(Math.ceil(filtered.length / limit));
//     setLoading(false);
//   };


const fetchCourses = async (page, limit, query, sort) => {
  setLoading(true);

  const response = await fetch("/data/courses.json"); // json file in public/data
  const data = await response.json();

  // ✅ Filter only teacher-owned courses
  let filtered = data.filter(
    (course) =>
      course.role === "student" && // only my created courses
      (course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor.toLowerCase().includes(query.toLowerCase()))
  );

  // Sorting
  filtered.sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "za") return b.title.localeCompare(a.title);
    return b.id - a.id; // newest
  });

  // Pagination logic
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageData = filtered.slice(startIndex, endIndex);

  setPaginatedCourses(pageData);
  setTotalPages(Math.ceil(filtered.length / limit));
  setLoading(false);
};


  // Refetch on changes
  useEffect(() => {
    fetchCourses(page, limit, searchQuery, sortOption);
  }, [searchQuery, sortOption, page]);

  return (
    <div className="p-2 min-h-screen">
      <PageTitle
        title="Enrolled Courses"
        subtitle="Browse all courses you joined across EduConnect"
      />

      {/* Filters */}
      <CourseFilters
        onSearch={(val) => {
          setPage(1); // reset to first page when search changes
          setSearchQuery(val);
        }}
        onSortChange={(val) => {
          setPage(1); // reset page on sort change
          setSortOption(val);
        }}
      />

      {/* Course Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
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

export default EnrolledCoursesPage;
