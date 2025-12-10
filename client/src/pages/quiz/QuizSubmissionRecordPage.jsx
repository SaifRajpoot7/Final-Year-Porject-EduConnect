import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useParams } from "react-router";

const QuizSubmissionRecordPage = () => {
  const { setMenuType, setCourseId, backendUrl, courseId } = useAppContext();
  const { quizId } = useParams();


  const tabs = ["All", "Pending Result", "Graded"];
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [quizzesSubmissions, setQuizzesSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchQuizzesSubmissions = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/quiz/all/${quizId}?courseId=${courseId}`);
        if (res.data.success) {
          setQuizzesSubmissions(res.data.submissions || []);
        } else {
          setQuizzesSubmissions([]);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setQuizzesSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzesSubmissions();
  }, [backendUrl, courseId]);

  const filteredQuizzesSubmissions =
    activeTab === "All"
      ? quizzesSubmissions
      : quizzesSubmissions.filter((a) => {
        if (activeTab === "Pending Result") return !a.result;
        if (activeTab === "Graded") return a.result != null;
        return true;
      });

  const startIndex = (page - 1) * limit;
  const pageData = filteredQuizzesSubmissions.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredQuizzesSubmissions.length / limit);

  useEffect(() => {
    setMenuType("course");
    return () => setMenuType("general");
  }, [setMenuType]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()}`;
  };

  return (
    <div className="p-4 min-h-screen">
      <PageTitle title="Quiz Submissions" subtitle="Manage and track Quiz submissions" />

      {/* <div className="flex gap-4 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`pb-2 px-2 font-medium transition ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm capitalize">
            <tr>
              <th className="px-4 py-3">Sr</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Total Marks</th>
              <th className="px-4 py-3">Submitted At</th>
              <th className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">Loading...</td>
              </tr>
            ) : pageData.length > 0 ?
              (
                pageData.map((quiz, index) => {
                  const isDuePassed = quiz.dueDate ? new Date() > new Date(quiz.dueDate) : false;
                  const dueDate = quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : "-"
                  const submitDate = quiz.submissionDate ? new Date(quiz.submissionDate).toLocaleDateString() : "-"

                  return (
                    <tr key={index} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{quiz.studentName}</td>
                      <td className="px-4 py-3">{quiz.title ?? "-"}</td>
                      <td className="px-4 py-3 text-red-500">{dueDate ?? "-"}</td>
                      <td className="px-4 py-3">{quiz.maxMarks ?? "-"}</td>
                      <td className="px-4 py-3">{submitDate ?? "-"}</td>
                      <td className="px-4 py-3">{quiz.result ?? "-"}</td>
                      
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">No Submission found</td>
                </tr>
              )}
          </tbody>
        </table>

      </div>

      {
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={`px-4 py-2 rounded-lg border ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Previous</button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={`px-4 py-2 rounded-lg border ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Next</button>
          </div>
        )
      }
    </div >
  );
};

export default QuizSubmissionRecordPage;
