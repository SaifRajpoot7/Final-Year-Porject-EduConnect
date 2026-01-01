import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router";
import AssignmentSubmitModal from "./AssignmentSubmitModal";
import ComponentLoader from "../../components/ComponentLoader";
import formatCustomDateTime from "../../utils/formatCustomDateTime";

const CourseAssignmentsPage = () => {
  const navigate = useNavigate()
  const { backendUrl } = useAppContext();

  const tabs = ["From My Creation", "From Enrollment"];
  const [activeTab, setActiveTab] = useState("From My Creation");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [assignments, setAssignments] = useState([]);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [assignmentFromMyCreation, setAssignmentFromMyCreation] = useState([]);
  const [assignmentFromEnrollment, setAssignmentFromEnrollment] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${backendUrl}/api/assignment/all`);
        if (res.data.success) {
          setAssignmentFromMyCreation(res.data.assignmentFromMyCreation || []);
          setAssignmentFromEnrollment(res.data.assignmentFromEnrollment || []);
          console.log('AssignmentFromMyCreation', assignmentFromMyCreation)
          console.log('AssignmentFromEnrollment', assignmentFromEnrollment)
        } else {
          setAssignmentFromMyCreation([]);
          setAssignmentFromEnrollment([]);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setAssignmentFromMyCreation([]);
        setAssignmentFromEnrollment([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [backendUrl]);

  const filteredAssignments =
    activeTab === "From My Creation"
      ? assignmentFromMyCreation
      : assignmentFromEnrollment

  const startIndex = (page - 1) * limit;
  const pageData = filteredAssignments.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredAssignments.length / limit);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()}`;
  };

  const openSubmitModal = (assignmentId, courseId) => {
    setSelectedAssignmentId(assignmentId);
    setSelectedCourseId(courseId);
    setShowModal(true);
  };
  return (
    <div className="p-4">
      <PageTitle title="Assignments" subtitle="Manage and track assignments" />
      {loading ? <ComponentLoader />
        :
        <>
          <div className="flex gap-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`pb-2 px-2 font-medium transition ${activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm capitalize">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Assignment File</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Total Marks</th>
                  {activeTab === "From My Creation" &&
                    <>
                      <th className="px-4 py-3">Total Submissions</th>
                      <th className="px-4 py-3">Total Graded</th>
                    </>
                  }
                  {activeTab === "From Enrollment" &&
                    <>
                      <th className="px-4 py-3">Submission Date</th>
                      <th className="px-4 py-3">Submission File</th>
                      <th className="px-4 py-3">Result</th>
                      <th className="px-4 py-3">Feedback</th>
                    </>
                  }
                  <th className="px-4 py-3">Action</th>
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
                        <tr
                          key={assignment._id}
                          className="border-t hover:bg-gray-50"
                        >

                          <td className="px-4 py-3">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-4 py-3">{assignment.course.title ?? "-"}</td>
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
                          <td className="px-4 py-3 text-red-500">{assignment.dueDate ? formatCustomDateTime(assignment.dueDate) : "-"}</td>
                          <td className="px-4 py-3">{assignment.maxMarks ?? "-"}</td>

                          {activeTab === "From My Creation" &&
                            <td className="px-4 py-3">{assignment.totalSubmissions ?? "-"}</td>
                          }

                          {activeTab === "From Enrollment" &&
                            <>
                              <td className="px-4 py-3">{assignment.submission?.submissionDate ? formatCustomDateTime(assignment.submission.submissionDate) : "-"}</td>
                              <td className="px-4 py-3">
                                {assignment.submission?.submissionFile ? (
                                  <a
                                    href={assignment.submission?.submissionFile}
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


                              <td className="px-4 py-3">{assignment.submission?.result ?? "-"}</td>
                              <td className="px-4 py-3">{assignment.submission?.feedback ?? "-"}</td>
                              <td className="px-4 py-3">
                                <button
                                  disabled={isDuePassed || assignment?.submission?.result}
                                  onClick={() => {
                                    !isDuePassed && openSubmitModal(assignment._id, assignment.course._id)
                                  }
                                  }
                                  className={`font-bold py-2 px-3 rounded ${isDuePassed
                                    ? "bg-gray-300 text-gray-500 text-xs cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}>
                                  {isDuePassed ? "Due Passed" : "Submit"}
                                </button>

                              </td>
                            </>
                          }

                          {activeTab === "From My Creation" && (
                            <>
                              <td className="px-4 py-3">{assignment.totalGraded ?? "-"}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => navigate(`/course/${assignment.course._id}/assignments/${assignment._id}`)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded cursor-pointer">
                                  View Details
                                </button>
                              </td>

                            </>
                          )}
                          {/* {isAdmin && (
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
                          )} */}
                          {/* {!isAdmin && (
                            <td className="px-4 py-3">
                              <button
                                disabled={isDuePassed}
                                onClick={() => !isDuePassed && openSubmitModal(assignment._id)}
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
                          )} */}
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
        </>
      }
      {
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={`px-4 py-2 rounded-lg border ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Previous</button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={`px-4 py-2 rounded-lg border ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Next</button>
          </div>
        )
      }

      <AssignmentSubmitModal open={showModal} onClose={() => setShowModal(false)} assignmentId={selectedAssignmentId} courseId={selectedCourseId} />
    </div >
  );
};

export default CourseAssignmentsPage;
