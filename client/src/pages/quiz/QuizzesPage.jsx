import React, { useState, useEffect } from "react";
import PageTitle from "../../components/other/PageTitle";

const QuizzesPage = () => {
  // Tabs
  const tabs = ["All", "Pending", "Attempted", "Graded", "Missed"];
  const [activeTab, setActiveTab] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Mock data (replace with API fetch)
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Simulated fetch (replace with API)
    fetch("/data/quizzes.json")
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  // Filtering
  const filteredQuizzes =
    activeTab === "All"
      ? quizzes
      : quizzes.filter((q) => q.status.toLowerCase() === activeTab.toLowerCase());

  // Pagination logic
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageData = filteredQuizzes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredQuizzes.length / limit);

  // Status colors
  const statusColors = {
    attempted: "bg-blue-100 text-blue-700",
    graded: "bg-green-100 text-green-700",
    missed: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="p-4 min-h-screen">
      <PageTitle
        title="Quizzes"
        subtitle="Manage and track your quizzes across all courses"
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`pb-2 px-2 font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Sr</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Quiz</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((quiz, index) => (
                <tr
                  key={quiz.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    {(page - 1) * limit + (index + 1)}
                  </td>
                  <td className="px-4 py-3">{quiz.course_name}</td>
                  <td className="px-4 py-3">
                    {quiz.quiz_name || `Quiz ${quiz.number}`}
                  </td>
                  <td className="px-4 py-3">{quiz.due_date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[quiz.status.toLowerCase()]
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                      View
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No quizzes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
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
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg border ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;