import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router";
import AssignmentSubmitModal from "./AssignmentSubmitModal";
import ComponentLoader from "../../components/ComponentLoader";

const CourseAssignmentsPage = () => {
  const navigate = useNavigate()
  const { setMenuType, backendUrl, courseId } = useAppContext();

  const tabs = ["All", "Pending Submission", "Pending Result", "Graded"];
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [assignments, setAssignments] = useState([]);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/assignment/all/course?courseId=${courseId}`);
        if (res.data.success) {
          setAssignments(res.data.values || []);
          setTitles(res.data.titles);
          setIsAdmin(res.data.isCourseAdmin);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [backendUrl, courseId]);

  const filteredAssignments =
    activeTab === "All"
      ? assignments
      : assignments.filter((a) => {
        if (activeTab === "Pending Submission") return !a.submission;
        if (activeTab === "Pending Result") return a.submission && !a.result;
        if (activeTab === "Graded") return a.result != null;
        return true;
      });

  const startIndex = (page - 1) * limit;
  const pageData = filteredAssignments.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredAssignments.length / limit);

  useEffect(() => {
    setMenuType("course");
    return () => setMenuType("general");
  }, [setMenuType]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()}`;
  };

  const openSubmitModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setShowModal(true);
  };
  return (
    <div className="p-4">
      <PageTitle title="Assignments" subtitle="Manage and track assignments" />
      {loading ? <ComponentLoader />
        :
        <>
          {!isAdmin && (
            <div className="flex gap-4 mb-6 border-b">
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
            </div>
          )}

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm capitalize">
                <tr>
                  {titles && titles.length > 0 ? (
                    titles.map((title, idx) => <th key={idx} className="px-4 py-3">{title}</th>)
                  ) : (
                    <th className="px-4 py-3">Assignments</th>
                  )}
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ?
                  (
                    pageData.map((assignment, index) => {
                      const isDuePassed = assignment.dueDate ? new Date() > new Date(assignment.dueDate) : false;
                      const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"
                      const submitDate = assignment.submissionDate ? new Date(assignment.submissionDate).toLocaleDateString() : "-"

                      return (
                        <tr key={index} className="border-t hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{assignment.Sr ?? "-"}</td>
                          <td className="px-4 py-3">{assignment.title ?? "-"}</td>
                          <td className="px-4 py-3">
                            {assignment.attachments && assignment.attachments[0] ? (
                              <a
                                href={assignment.attachments[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Assignment File
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-red-500">{dueDate ?? "-"}</td>
                          <td className="px-4 py-3">{assignment.maxMarks ?? "-"}</td>
                          {isAdmin && (
                            <td className="px-4 py-3">{assignment.totalSubmissions ?? "-"}</td>
                          )}
                          {isAdmin && (
                            <td className="px-4 py-3">{assignment.totalGraded ?? "-"}</td>
                          )}
                          {!isAdmin && (
                            <>
                              <td className="px-4 py-3">
                                {assignment.submission ? (
                                  <a
                                    href={assignment.submission}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    Submission File
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </td>

                              <td className="px-4 py-3">{submitDate ?? "-"}</td>

                              <td className="px-4 py-3">{assignment.result ?? "-"}</td>
                              <td className="px-4 py-3">{assignment.feedback ?? "-"}</td>
                            </>
                          )}
                          {!isAdmin && (
                            <td className="px-4 py-3">
                              <button
                                disabled={isDuePassed}
                                onClick={() => !isDuePassed && openSubmitModal(assignment._id, courseId)}
                                className={`font-bold py-2 px-3 rounded ${isDuePassed
                                  ? "bg-gray-300 text-gray-500 text-xs cursor-not-allowed"
                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                                  }`}
                              >
                                {isDuePassed ? "Due Passed" : "Submit"}
                              </button>
                            </td>
                          )}

                          {isAdmin && (
                            <td className="px-4 py-3">
                              <button
                                onClick={() => navigate(`${assignment._id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded cursor-pointer">
                                View Details
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-6 text-gray-500">No assignments found</td>
                    </tr>
                  )}
              </tbody>
            </table>

          </div>
        </>}

      {
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={`px-4 py-2 rounded-lg border ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Previous</button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={`px-4 py-2 rounded-lg border ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Next</button>
          </div>
        )
      }

      <AssignmentSubmitModal open={showModal} onClose={() => setShowModal(false)} assignmentId={selectedAssignmentId} courseId={courseId} />
    </div >
  );
};

export default CourseAssignmentsPage;
