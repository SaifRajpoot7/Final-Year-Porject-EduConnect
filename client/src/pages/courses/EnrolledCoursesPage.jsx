import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../../components/CourseCard";
import PageTitle from "../../components/other/PageTitle";
import CourseFilters from "../../components/CourseFilters";
import { useAppContext } from "../../contexts/AppContext";
import ComponentLoader from "../../components/ComponentLoader";

const AllCoursesPage = () => {
  const { backendUrl } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- Fetch from Backend API ---
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${backendUrl}/api/course/all`, {
        params: {
          page,
          limit,
          search: searchQuery,
          sort: sortOption,
          type: "joined"
        },
      });

      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters or page change
  useEffect(() => {
    fetchCourses();
  }, [page, searchQuery, sortOption]);

  return (
    <div className="p-2">
      <PageTitle
        title="Enrolled Courses"
        subtitle="Browse all courses you joined across EduConnect"
      />

      {/* Filters */}
      <CourseFilters
        onSearch={(val) => {
          setPage(1);
          setSearchQuery(val);
        }}
        onSortChange={(val) => {
          setPage(1);
          setSortOption(val);
        }}
      />

      {/* Conditional Render */}
      {loading ? (
        <ComponentLoader />
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No Course Found.
        </p>
      ) : (
        <>
          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} {...course} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg border ${page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
                }`}
            >
              Previous
            </button>

            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg border ${page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllCoursesPage;
